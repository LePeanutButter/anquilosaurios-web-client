<script lang="ts">
	import { onMount } from 'svelte';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	const iframeSrc = '/game';

	let iframeEl: HTMLIFrameElement | null = null;
	let initialized = false;

	function onIframeLoad() {
		if (initialized) return;
		try {
			const doc = iframeEl?.contentDocument;
			if (!doc) {
				console.warn('[PARENT] no contentDocument — maybe cross-origin');
				return;
			}

			const css = `
				body > * { display: none !important; }
				#unity-container { display: block !important; position: static !important; width: 100% !important; height: 100% !important; }
				html, body { height: 100%; margin: 0; }
			`;
			const style = doc.createElement('style');
			style.type = 'text/css';
			style.appendChild(doc.createTextNode(css));
			doc.head.appendChild(style);

			const container = doc.getElementById('unity-container');
			if (container) {
				container.style.width = '100%';
				container.style.height = '100%';
			}

			initialized = true;
			console.log('[PARENT] injected CSS into iframe and exposed #unity-container only');
		} catch (err) {
			console.error('[PARENT] error accessing iframe document:', err);
		}
	}

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
