<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import Header from './Header.svelte';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Header/>
	</svelte:fragment>
	<slot/>
</AppShell>
