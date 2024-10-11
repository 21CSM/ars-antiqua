<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import VerovioWorker from '$lib/score/verovioWorker?worker';
	
	export let meiData: string = '';
	
	let container: HTMLDivElement;
	let worker: Worker | null = null;
	let isVerovioReady = false;
	let error: string | null = null;
	
	interface WorkerMessage {
	  action: 'dataLoaded' | 'renderComplete' | 'optionsSet';
	  svg?: string;
	  error?: string;
	}
	
	function debounce(func: Function, wait: number) {
	  let timeout: ReturnType<typeof setTimeout>;
	  return function executedFunction(...args: any[]) {
		const later = () => {
		  clearTimeout(timeout);
		  func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	  };
	}
	
	onMount(() => {
	  worker = new VerovioWorker();
	  worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
		const { action, svg, error: workerError } = e.data;
		if (workerError) {
		  console.error('Worker error:', workerError);
		  error = workerError;
		  return;
		}
		if (action === 'optionsSet') {
		  isVerovioReady = true;
		  renderScore();
		}
		if (action === 'renderComplete' && svg) {
		  error = null;
		  container.innerHTML = svg;
		}
	  };
	
	  const handleResize = debounce(() => {
		if (worker && container) {
		  worker.postMessage({
			action: 'setOptions',
			options: { pageWidth: container.clientWidth }
		  });
		  renderScore();
		}
	  }, 250);
	
	  window.addEventListener('resize', handleResize);
	
	  return () => {
		window.removeEventListener('resize', handleResize);
	  };
	});
	
	onDestroy(() => {
	  if (worker) {
		worker.terminate();
	  }
	});
	
	function initializeVerovio() {
	  if (worker && container) {
		worker.postMessage({
		  action: 'setOptions',
		  options: {
			scale: 40,
			adjustPageHeight: true,
			pageWidth: container.clientWidth,
			pageHeight: 100000
		  }
		});
	  }
	}
	
	function renderScore() {
	  if (worker && meiData && isVerovioReady) {
		worker.postMessage({ action: 'loadData', data: meiData });
		worker.postMessage({ action: 'renderToSVG', page: 1 });
	  }
	}
	
	$: if (container && worker && !isVerovioReady) {
	  initializeVerovio();
	}
	
	$: if (isVerovioReady && meiData) {
	  renderScore();
	}
	</script>
	
	<div bind:this={container} class="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md">
	  {#if !isVerovioReady}
		<p class="text-center text-gray-500">Initializing score renderer...</p>
	  {:else if error}
		<p class="text-center text-red-500">Error: {error}</p>
	  {/if}
	</div>