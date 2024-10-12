import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';

let verovioToolkit: VerovioToolkit | null = null;

function postLog(message: string) {
	self.postMessage({ action: 'log', log: message });
}

async function initializeVerovio() {
	if (!verovioToolkit) {
		try {
			postLog('Creating Verovio module...');
			const VerovioModule = await createVerovioModule();
			postLog('Verovio module created successfully');
			verovioToolkit = new VerovioToolkit(VerovioModule);
			postLog('Verovio toolkit initialized');
			postLog(`Verovio version: ${verovioToolkit.getVersion()}`);
		} catch (error) {
			postLog(`Error initializing Verovio: ${error}`);
			throw error;
		}
	}
}

async function withVerovio(action: () => void) {
	await initializeVerovio();
	if (!verovioToolkit) {
		throw new Error('Failed to initialize Verovio');
	}
	action();
}

self.onmessage = async function (e: MessageEvent) {
	postLog(`Received message in worker: ${JSON.stringify(e.data)}`);
	try {
		await withVerovio(() => {
			const { action, data, page, options } = e.data;
			postLog(`Processing action: ${action}`);
			switch (action) {
				case 'loadData':
					if (data) {
						postLog(`Loading data: ${data.substring(0, 100)}...`);
						verovioToolkit!.loadData(data);
						self.postMessage({ action: 'dataLoaded' });
					} else {
						throw new Error('No data provided for loading');
					}
					break;
				case 'renderToSVG':
					if (typeof page === 'number') {
						postLog('Starting renderToSVG...');
						const svg = verovioToolkit!.renderToSVG(page, !!options);
						postLog('renderToSVG completed successfully');
						self.postMessage({ action: 'renderComplete', svg });
					} else {
						throw new Error('Invalid page number for rendering');
					}
					break;
				case 'setOptions':
					if (options) {
						postLog(`Setting options: ${JSON.stringify(options)}`);
						verovioToolkit!.setOptions(options);
						self.postMessage({ action: 'optionsSet' });
					} else {
						throw new Error('No options provided');
					}
					break;
				default:
					throw new Error('Unknown action');
			}
		});
	} catch (error) {
		postLog(`Error in worker: ${error}`);
		if (error instanceof Error) {
			self.postMessage({ action: 'error', error: error.message, stack: error.stack });
		} else {
			self.postMessage({ action: 'error', error: String(error) });
		}
	}
};

export {};
