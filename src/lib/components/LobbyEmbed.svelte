<!--
  @component LobbyEmbed

  Embeds the Unity WebGL game inside an iframe with Navbar and Footer.

  ## Features

  - Displays a Navbar at the top and Footer at the bottom.
  - Embeds the Unity game using an iframe sourced from the environment variable VITE_AZURE_GAME_URL.
  - Handles iframe load events with a console log.
  - Responsive layout with centered iframe and styling.

  ## Props

  None.

  ## Usage

  <LobbyEmbed />
-->
  
<script lang="ts">
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	const iframeSrc = import.meta.env.VITE_AZURE_GAME_URL;

	let iframeEl: HTMLIFrameElement | null = null;

	function onIframeLoad() {
		console.log('[PARENT] Unity WebGL iframe loaded');
	}
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
		on:load={onIframeLoad}
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
