<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import VerovioWorker from '$lib/score/verovioWorker?worker';

	export let meiData: string = '';
	let container: HTMLDivElement;
	let worker: Worker | null = null;
	let isVerovioReady = false;
	let error: string | null = null;

	interface WorkerMessage {
		action: 'dataLoaded' | 'renderComplete' | 'optionsSet' | 'error';
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
		console.log('Mounting ScoreViewer component');
		try {
			worker = new VerovioWorker();
			console.log('Verovio Worker created successfully');

			worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
				console.log('Received message from worker:', e.data);
				const { action, svg, error: workerError } = e.data;

				if (action === 'error' || workerError) {
					console.error('Worker error:', workerError);
					error = workerError || 'Unknown error occurred';
					return;
				}

				if (action === 'optionsSet') {
					console.log('Verovio options set successfully');
					isVerovioReady = true;
					renderScore();
				}

				if (action === 'renderComplete' && svg) {
					console.log('Render complete, updating SVG');
					error = null;
					container.innerHTML = svg;
				}

				if (action === 'dataLoaded') {
					console.log('MEI data loaded successfully');
				}
			};

			worker.onerror = (err) => {
				console.error('Worker error event:', err);
				error = 'An error occurred in the score renderer';
			};

			const handleResize = debounce(() => {
				console.log('Handling resize event');
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
		} catch (err) {
			console.error('Error in onMount:', err);
			error = 'Failed to initialize score renderer';
		}
	});

	onDestroy(() => {
		console.log('Destroying ScoreViewer component');
		if (worker) {
			worker.terminate();
			console.log('Worker terminated');
		}
	});

	function initializeVerovio() {
		console.log('Initializing Verovio');
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
		} else {
			console.warn('Worker or container not available for initialization');
		}
	}

	function renderScore() {
		console.log('Rendering score', { isVerovioReady, meiDataLength: meiData?.length });
		if (worker && meiData && isVerovioReady) {
			worker.postMessage({ action: 'loadData', data: meiData });
			worker.postMessage({ action: 'renderToSVG', page: 1 });
		} else {
			console.warn('Unable to render score: worker, meiData, or Verovio not ready');
		}
	}

	$: if (container && worker && !isVerovioReady) {
		console.log('Container and worker available, initializing Verovio');
		initializeVerovio();
	}

	$: if (isVerovioReady && meiData) {
		console.log('Verovio ready and MEI data available, rendering score');
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
