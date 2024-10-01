<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import VerovioWorker from '$lib/score/verovioWorker?worker';

	export let meiData: string = '';
	let container: HTMLDivElement;
	let worker: Worker | null = null;
	let isVerovioReady = false;

	interface WorkerMessage {
		action: 'dataLoaded' | 'renderComplete' | 'optionsSet';
		svg?: string;
		error?: string;
	}

	onMount(() => {
		worker = new VerovioWorker();

		worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
			const { action, svg, error } = e.data;
			if (error) {
				console.error('Worker error:', error);
				return;
			}
			if (action === 'optionsSet') {
				isVerovioReady = true;
				renderScore();
			}
			if (action === 'renderComplete' && svg) {
				container.innerHTML = svg;
			}
		};

		initializeVerovio();

		const handleResize = () => {
			if (worker) {
				worker.postMessage({
					action: 'setOptions',
					options: { pageWidth: container.clientWidth }
				});
				renderScore();
			}
		};

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

	function renderScore(): void {
		if (worker && meiData && isVerovioReady) {
			worker.postMessage({ action: 'loadData', data: meiData });
			worker.postMessage({ action: 'renderToSVG', page: 1 });
		}
	}

	$: if (isVerovioReady && meiData) {
		renderScore();
	}
</script>

<div bind:this={container} class="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md">
	{#if !isVerovioReady}
		<p class="text-center text-gray-500">Initializing score renderer...</p>
	{/if}
</div>
