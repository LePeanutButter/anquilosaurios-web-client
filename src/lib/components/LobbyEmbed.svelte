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
	import { authStore } from '$lib/authStore';
	import { onMount } from 'svelte';

	const iframeSrc =
		'http://20.168.245.216/play';

	let iframeEl: HTMLIFrameElement | null = null;
	let verificationState: 'idle' | 'loading' | 'verifying' | 'success' | 'error' = 'idle';
	let verificationMessage = '';
	let verificationProgress = 0;
	let showIframe = false;

	let userToken: string | null = null;
	let userName: string | null = null;
	let userEmail: string | null = null;

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			userToken = state.token;
			userName = state.user?.name || null;
			userEmail = state.user?.email || null;

			console.log('[LOBBY] Usuario autenticado:', {
				token: userToken ? 'Presente' : 'No presente (anónimo)',
				name: userName || 'Anónimo',
				email: userEmail || 'Sin email'
			});
		});

		skipVerificationAndLoad();

		return unsubscribe;
	});

	function skipVerificationAndLoad() {
		verificationState = 'loading';
		verificationMessage = 'Cargando juego...';
		verificationProgress = 50;

		setTimeout(() => {
			verificationState = 'success';
			verificationProgress = 100;
			verificationMessage = 'Juego listo';

			setTimeout(() => {
				showIframe = true;
			}, 300);
		}, 1000);
	}

	function onIframeLoad() {
		console.log('[LOBBY] Unity iframe loaded');

		if (!iframeEl || !iframeEl.contentWindow) {
			console.error('[LOBBY] No se pudo acceder al iframe');
			return;
		}

		setTimeout(() => {
			sendUserDataToUnity();
		}, 2000);
	}

	function sendUserDataToUnity() {
		if (!iframeEl || !iframeEl.contentWindow) {
			console.error('[LOBBY] No se pudo acceder al iframe');
			return;
		}

		const userData = {
			type: 'USER_AUTH_DATA',
			token: userToken || null,
			userName: userName || null,
			userEmail: userEmail || null,
			timestamp: Date.now()
		};

		console.log('[LOBBY] Enviando datos a Unity:', userData);

		iframeEl.contentWindow.postMessage(userData, '*');

		let retryCount = 0;
		const retryInterval = setInterval(() => {
			if (retryCount >= 10) {
				clearInterval(retryInterval);
				console.log('[LOBBY] Se detuvieron los reintentos de envío');
				return;
			}

			console.log(`[LOBBY] Reintentando envío de datos (${retryCount + 1}/10)`);
			iframeEl?.contentWindow?.postMessage(userData, '*');
			retryCount++;
		}, 3000);
	}

	function handleMessageFromUnity(event: MessageEvent) {
		if (event.source !== iframeEl?.contentWindow) {
			return;
		}

		console.log('[LOBBY] Mensaje recibido de Unity:', event.data);

		if (event.data.type === 'UNITY_READY') {
			console.log('[LOBBY] Unity está listo, enviando datos...');
			sendUserDataToUnity();
		} else if (event.data.type === 'USER_DATA_RECEIVED') {
			console.log('[LOBBY] Unity confirmó recepción de datos del usuario');
		}
	}

	onMount(() => {
		window.addEventListener('message', handleMessageFromUnity);

		return () => {
			window.removeEventListener('message', handleMessageFromUnity);
		};
	});

	async function calculateSHA256(buffer: ArrayBuffer): Promise<string> {
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}

	/**
	 * Descarga un archivo y calcula su hash
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function _fetchAndHash(url: string): Promise<{ buffer: ArrayBuffer; hash: string }> {
		const response = await fetch(url, {
			method: 'GET',
			credentials: 'omit'
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch ${url}: ${response.status}`);
		}

		const buffer = await response.arrayBuffer();
		const hash = await calculateSHA256(buffer);

		return { buffer, hash };
	}

	/**
	 * Obtiene la lista de archivos críticos del Build de Unity
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function _getUnityFiles(baseUrl: string): Promise<string[]> {
		try {
			const manifestUrl = `${baseUrl}/webgl-manifest.json`;
			const response = await fetch(manifestUrl);

			if (response.ok) {
				const manifest = await response.json();
				return Object.keys(manifest.files || {});
			}
		} catch (err) {
			console.warn('Could not fetch manifest, using default file patterns', err);
		}

		return [
			'Build/webgl.loader.js',
			'Build/webgl.framework.js',
			'Build/webgl.data',
			'Build/webgl.wasm'
		];
	}

	/**
	 * Verifica la integridad de todos los archivos de Unity
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function _verifyIntegrity() {
		console.log('[LOBBY] Verificación de integridad omitida (build local)');
		skipVerificationAndLoad();
	}

	function retryVerification() {
		verificationState = 'idle';
		verificationMessage = '';
		verificationProgress = 0;
		showIframe = false;
		skipVerificationAndLoad();
	}
</script>

<svelte:window on:message={handleMessageFromUnity} />

<Navbar />

<main class="lobby">
	{#if !showIframe}
		<div class="verification-overlay">
			<div class="verification-card">
				<h2>Cargando Juego</h2>

				{#if verificationState === 'idle' || verificationState === 'loading' || verificationState === 'verifying'}
					<div class="loading-container">
						<div class="spinner"></div>
						<p class="status-message">{verificationMessage}</p>
						<div class="progress-bar">
							<div class="progress-fill" style="width: {verificationProgress}%"></div>
						</div>
						<p class="progress-text">{verificationProgress}%</p>
					</div>
				{:else if verificationState === 'error'}
					<div class="error-container">
						<div class="error-icon"></div>
						<p class="error-message">{verificationMessage}</p>
						<p class="error-detail">Hubo un problema al cargar el juego.</p>
						<button class="retry-button" on:click={retryVerification}> Reintentar </button>
					</div>
				{:else if verificationState === 'success'}
					<div class="success-container">
						<div class="success-icon"></div>
						<p class="success-message">Juego listo</p>
						<p class="success-detail">Iniciando...</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<iframe
			class="game-frame"
			bind:this={iframeEl}
			src={iframeSrc}
			title="Juego embebido de POWER GARDEN: Juicy Brawl!"
			allow="fullscreen; autoplay; encrypted-media"
			loading="lazy"
			on:load={onIframeLoad}
		></iframe>
	{/if}
</main>

<Footer />

<style>
	.lobby {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: white !important;
	}

	.game-frame {
		width: 90%;
		height: 80vh;
		border: none;
		border-radius: 12px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
		animation: fadeIn 0.5s ease-in;
	}

	.verification-overlay {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.verification-card {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		max-width: 500px;
		width: 90%;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		text-align: center;
	}

	.verification-card h2 {
		margin: 0 0 2rem 0;
		color: #333;
		font-size: 1.8rem;
	}

	.loading-container,
	.error-container,
	.success-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.spinner {
		width: 60px;
		height: 60px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.status-message {
		color: #666;
		font-size: 1rem;
		margin: 0;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: #e0e0e0;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 1rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, white 0%, #003d80 100%);
		transition: width 0.3s ease;
	}

	.progress-text {
		color: #999;
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0.5rem 0 0 0;
	}

	.error-icon,
	.success-icon {
		font-size: 4rem;
	}

	.error-message,
	.success-message {
		color: #333;
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0;
	}

	.error-detail,
	.success-detail {
		color: #666;
		font-size: 0.95rem;
		line-height: 1.5;
		margin: 0;
	}

	.retry-button {
		margin-top: 1.5rem;
		padding: 0.75rem 2rem;
		background: white;
		color: #003d80;
		border: 2px solid #003d80;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.retry-button:hover {
		background: #003d80;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 61, 128, 0.4);
	}

	.retry-button:active {
		transform: translateY(0);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-width: 768px) {
		.verification-card {
			padding: 2rem;
		}

		.verification-card h2 {
			font-size: 1.5rem;
		}

		.game-frame {
			width: 95%;
			height: 70vh;
		}
	}
</style>
