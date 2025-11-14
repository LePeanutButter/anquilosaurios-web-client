<script lang="ts">
	import { onMount } from 'svelte';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	const iframeSrc = import.meta.env.VITE_AZURE_GAME_URL;

	let iframeEl: HTMLIFrameElement | null = null;

	onMount(() => {
		function msgLog(e: MessageEvent) {
			console.log('[PARENT] iframe message:', e.origin, e.data);
		}
		window.addEventListener('message', msgLog);

		return () => window.removeEventListener('message', msgLog);
	});
</script>

<Navbar />
<main class="lobby">
	<iframe
		class="game-frame"
		bind:this={iframeEl}
		src={iframeSrc}
		title="Juego embebido de POWER GARDEN: Juicy Brawl!"
		allow="fullscreen; autoplay; encrypted-media"
		loading="lazy"
	></iframe>
</main>
<Footer />

<style>
	.lobby {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}
	.game-frame {
		width: 90%;
		height: 80vh;
		border: none;
		border-radius: 12px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
	}
</style>
