import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';

interface WorkerMessage {
	action: 'loadData' | 'renderToSVG' | 'setOptions';
	data?: string;
	page?: number;
	options?: Record<string, any>;
}

let verovioToolkit: VerovioToolkit | null = null;

async function initializeVerovio() {
	if (!verovioToolkit) {
		const VerovioModule = await createVerovioModule();
		verovioToolkit = new VerovioToolkit(VerovioModule);
	}
}

self.onmessage = async function (e: MessageEvent<WorkerMessage>) {
	await initializeVerovio();

	if (!verovioToolkit) {
		self.postMessage({ error: 'Failed to initialize Verovio' });
		return;
	}

	const { action, data, page, options } = e.data;

	switch (action) {
		case 'loadData':
			if (data) {
				verovioToolkit.loadData(data);
				self.postMessage({ action: 'dataLoaded' });
			} else {
				self.postMessage({ error: 'No data provided for loading' });
			}
			break;
		case 'renderToSVG':
			if (typeof page === 'number') {
				const svg = verovioToolkit.renderToSVG(page, !!options);
				self.postMessage({ action: 'renderComplete', svg });
			} else {
				self.postMessage({ error: 'Invalid page number for rendering' });
			}
			break;
		case 'setOptions':
			if (options) {
				verovioToolkit.setOptions(options);
				self.postMessage({ action: 'optionsSet' });
			} else {
				self.postMessage({ error: 'No options provided' });
			}
			break;
		default:
			self.postMessage({ error: 'Unknown action' });
	}
};

export {};
