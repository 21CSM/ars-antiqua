<script lang="ts">
	import { onMount } from 'svelte';
	import ScoreViewer from '$lib/components/score/ScoreViewer.svelte';
	import { storage } from '$lib/firebase';
  
	const meiFiles = [
	  { path: 'mei_files/medieval_chant.mei', title: 'Medieval Chant Example' },
	  { path: 'renaissance_mei_1.mei', title: 'Renaissance Motet Example' },
	  { path: 'baroque_mei_1.mei', title: 'Baroque Fugue Example' },
	  // Add more MEI files as needed
	];
  
	let meiDataMap: Record<string, string> = {};
	let loadingStatus: Record<string, boolean> = {};
	let errors: Record<string, string | null> = {};
  
	onMount(async () => {
	  for (const file of meiFiles) {
		loadingStatus[file.path] = true;
		try {
		  meiDataMap[file.path] = await storage.fetchFile(file.path);
		} catch (e) {
		  console.error(`Error fetching MEI data for file "${file.path}":`, e);
		  errors[file.path] = (e as Error).message;
		} finally {
		  loadingStatus[file.path] = false;
		}
	  }
	});
  </script>
  
  <svelte:head>
	<title>Historical Music Notation Examples</title>
  </svelte:head>
  
  <div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Historical Music Notation Examples</h1>
	
	<div class="mb-6">
	  <p class="text-lg mb-2">
		This page demonstrates various examples of historical music notation using the Music Encoding Initiative (MEI) format, rendered with the Verovio library.
	  </p>
	</div>
  
	{#each meiFiles as file}
	  <div class="mb-8">
		<h2 class="text-2xl font-bold mb-4">{file.title}</h2>
		<div class="bg-gray-100 p-6 rounded-lg shadow-inner">
		  {#if loadingStatus[file.path]}
			<p class="text-center text-gray-500">Loading musical score data...</p>
		  {:else if errors[file.path]}
			<p class="text-center text-red-500">{errors[file.path]}</p>
		  {:else}
			<ScoreViewer meiData={meiDataMap[file.path]} />
		  {/if}
		</div>
	  </div>
	{/each}
  
	<div class="mt-6">
	  <h2 class="text-2xl font-semibold mb-2">About Historical Music Notation</h2>
	  <p>
		Music notation has evolved significantly over the centuries. From the early neumes of medieval chant to the complex scores of the Baroque era, each period brought its own innovations and conventions to written music. The examples above showcase some of these historical styles, demonstrating the rich diversity of musical notation throughout Western music history.
	  </p>
	</div>
  </div>