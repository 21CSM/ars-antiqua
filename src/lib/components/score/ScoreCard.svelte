<script lang="ts">
	import type { Score } from '$lib/types';
	import TagBadge from './TagBadge.svelte';

	export let score: Score;
	export let onClick: (id: string) => void;
</script>

<div
	class="card card-hover overflow-hidden cursor-pointer"
	on:click={() => onClick(score.id)}
	on:keydown={(e) => e.key === 'Enter' && onClick(score.id)}
	tabindex="0"
	role="button"
>
	<img src={score.thumbnailUrl} alt={score.title} class="w-full h-48 object-cover" />
	<div class="p-4">
		<h3 class="h3 mb-2 truncate">{score.title}</h3>
		<div class="flex flex-wrap gap-1 mb-2">
			{#if score.tags && score.tags.length > 0}
				{#each score.tags as tag}
					<TagBadge {tag} />
				{/each}
			{:else}
				<span class="text-sm text-gray-500">No tags</span>
			{/if}
		</div>
		<p class="text-sm text-gray-500 mt-2">Last modified: {score.lastModified}</p>
	</div>
</div>
