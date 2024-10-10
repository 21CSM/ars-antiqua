<script lang="ts">
	import IconMusicNote from '~icons/mdi/music-note';
</script>

<div class="flex flex-col items-center justify-center h-screen space-y-4">
	<div class="music-note-loader">
		<IconMusicNote class="text-primary-500 w-12 h-12" />
	</div>
	<p class="text-lg font-semibold text-gray-300">Loading...</p>
</div>

<style>
	.music-note-loader {
		animation: bounce 1.5s infinite;
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% {
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