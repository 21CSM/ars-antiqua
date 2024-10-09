<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconFilterOutline from '~icons/mdi/filter-outline';
	import IconChevronDown from '~icons/mdi/chevron-down';

	export let tags: string[];
	export let selectedTag = 'All';

	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		dispatch('change', target.value);
	}
</script>

<div class="relative w-48">
	<select
		bind:value={selectedTag}
		on:change={handleChange}
		class="select pl-10 pr-8 py-2 w-full h-10 appearance-none"
	>
		{#each tags as tag}
			<option value={tag}>{tag}</option>
		{/each}
	</select>
	<IconFilterOutline
		class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-500"
	/>
	<IconChevronDown
		class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-500"
	/>
</div>
