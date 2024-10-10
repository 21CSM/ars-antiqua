<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconMagnify from '~icons/mdi/magnify';

	export let value = '';
	const dispatch = createEventDispatcher();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('input', target.value);
	}
</script>

<div class="relative flex-grow">
	<input
		type="text"
		placeholder="Search scores..."
		class="input pl-10 pr-4 py-2 w-full h-10"
		{value}
		on:input={handleInput}
	/>
	<IconMagnify
		class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-500"
	/>
</div>
