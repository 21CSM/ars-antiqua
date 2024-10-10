<script lang="ts">
	import { goto } from '$app/navigation';
	import IconEmoticonSad from '~icons/mdi/emoticon-sad';
	import IconHome from '~icons/mdi/home';

	function goHome() {
		goto('/');
	}
</script>

<div class="flex flex-col items-center justify-center h-full text-center p-4">
	<div class="text-6xl mb-6 animate-bounce text-primary-500">
		<IconEmoticonSad />
	</div>

	<h1 class="text-4xl font-bold mb-4">Oops! Page Not Found</h1>

	<p class="text-xl mb-8 max-w-md">
		We couldn't find the page you're looking for. It might have been moved or doesn't exist.
	</p>

	<button
		on:click={goHome}
		class="btn variant-ghost-surface flex items-center justify-center mt-4"
	>
		<IconHome class="mr-2" />

		Return Home
	</button>
</div>

<style>
	.animate-bounce {
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(-25%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}

		50% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}
</style>
