import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';

interface WorkerMessage {
  action: 'loadData' | 'renderToSVG' | 'setOptions';
  data?: string;
  page?: number;
  options?: Record<string, any>;
}

let verovioToolkit: VerovioToolkit | null = null;

function workerLog(...args: any[]) {
  self.postMessage({ type: 'log', message: args.map(arg => String(arg)).join(' ') });
}

async function initializeVerovio() {
  if (!verovioToolkit) {
    try {
      workerLog('Creating Verovio module...');
      const VerovioModule = await createVerovioModule();
      workerLog('Verovio module created successfully');
      verovioToolkit = new VerovioToolkit(VerovioModule);
      workerLog('Verovio toolkit initialized');
      workerLog('Verovio version:', verovioToolkit.getVersion());
    } catch (error) {
      workerLog('Error initializing Verovio:', error);
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

self.onmessage = async function (e: MessageEvent<WorkerMessage>) {
  try {
    await withVerovio(() => {
      const { action, data, page, options } = e.data;
      workerLog(`Received action: ${action}`);
      switch (action) {
        case 'loadData':
          if (data) {
            workerLog('Loading data:', data.substring(0, 100) + '...');
            verovioToolkit!.loadData(data);
            self.postMessage({ action: 'dataLoaded' });
          } else {
            throw new Error('No data provided for loading');
          }
          break;
        case 'renderToSVG':
          if (typeof page === 'number') {
            try {
              workerLog('Starting renderToSVG...');
              // Add a small delay before rendering
              setTimeout(() => {
                const svg = verovioToolkit!.renderToSVG(page, !!options);
                workerLog('renderToSVG completed successfully');
                self.postMessage({ action: 'renderComplete', svg });
              }, 100);
            } catch (error) {
              workerLog('Error in renderToSVG:', error);
              throw error;
            }
          } else {
            throw new Error('Invalid page number for rendering');
          }
          break;
        case 'setOptions':
          if (options) {
            workerLog('Setting options:', options);
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
    workerLog('Error in worker:', error);
    if (error instanceof Error) {
      self.postMessage({ error: error.message });
    } else {
      self.postMessage({ error: String(error) });
    }
  }
};

export {};