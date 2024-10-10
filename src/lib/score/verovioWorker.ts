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
    try {
      console.log('Initializing Verovio...');
      const VerovioModule = await createVerovioModule();
      verovioToolkit = new VerovioToolkit(VerovioModule);
      console.log('Verovio initialized successfully');
    } catch (error) {
      console.error('Error initializing Verovio:', error);
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
      console.log(`Received action: ${action}`);

      switch (action) {
        case 'loadData':
          if (data) {
            verovioToolkit!.loadData(data);
            self.postMessage({ action: 'dataLoaded' });
          } else {
            throw new Error('No data provided for loading');
          }
          break;

        case 'renderToSVG':
          if (typeof page === 'number') {
            const svg = verovioToolkit!.renderToSVG(page, !!options);
            self.postMessage({ action: 'renderComplete', svg });
          } else {
            throw new Error('Invalid page number for rendering');
          }
          break;

        case 'setOptions':
          if (options) {
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
    console.error('Error in worker:', error);
    self.postMessage({ error: (error as Error).message });
  }
};

export {};