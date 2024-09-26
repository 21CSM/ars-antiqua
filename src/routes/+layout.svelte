<script lang="ts">
	import '../app.postcss';
	import { user } from '$lib/stores/user'; // Your user store
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import { onDestroy } from 'svelte';
	import IconMusicNote from '~icons/mdi/music-note'; // Import the music note icon

	let loading = true;
	let authenticated = false;

	const unsubscribe = user.subscribe((state) => {
		loading = state.loading;
		authenticated = !!state.user;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div>
	{#if loading}
		<div class="flex flex-col items-center justify-center h-screen space-y-4">
			<div class="music-note-loader">
				<IconMusicNote class="text-primary-500 w-12 h-12" />
			</div>
			<p class="text-lg font-semibold text-gray-300">Loading...</p>
		</div>
	{:else if authenticated}
		<slot />
	{:else}
		<LoginForm />
	{/if}
</div>

<style>
	.music-note-loader {
		animation: bounce 1.5s infinite;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-30px);
		}
		60% {
			transform: translateY(-15px);
		}
	}
</style>
