<script lang="ts">
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';
	
	const iframeSrc = import.meta.env.VITE_AZURE_GAME_URL;
	let iframeEl: HTMLIFrameElement | null = null;
	
	// Estados de verificación
	let verificationState: 'idle' | 'loading' | 'verifying' | 'success' | 'error' = 'idle';
	let verificationMessage = '';
	let verificationProgress = 0;
	let showIframe = false;

	/**
	 * Calcula el SHA-256 de un ArrayBuffer
	 */
	async function calculateSHA256(buffer: ArrayBuffer): Promise<string> {
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}

	/**
	 * Descarga un archivo y calcula su hash
	 */
	async function fetchAndHash(url: string): Promise<{ buffer: ArrayBuffer; hash: string }> {
		const response = await fetch(url, {
			method: 'GET',
			credentials: 'omit',
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
	async function getUnityFiles(baseUrl: string): Promise<string[]> {
		try {
			// Intenta obtener la lista de archivos del manifest
			const manifestUrl = `${baseUrl}/webgl-manifest.json`;
			const response = await fetch(manifestUrl);
			
			if (response.ok) {
				const manifest = await response.json();
				return Object.keys(manifest.files || {});
			}
		} catch (err) {
			console.warn('Could not fetch manifest, using default file patterns', err);
		}

		// Si no se puede obtener el manifest, usa patrones comunes de Unity WebGL
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
	async function verifyIntegrity() {
		try {
			verificationState = 'loading';
			verificationMessage = 'Descargando manifest de integridad...';
			verificationProgress = 10;

			// Obtener el manifest con los hashes esperados
			const manifestUrl = `${iframeSrc}/webgl-manifest.json`;
			const manifestResponse = await fetch(manifestUrl);
			
			if (!manifestResponse.ok) {
				throw new Error('No se pudo obtener el manifest de integridad');
			}

			const manifest = await manifestResponse.json();
			const files = manifest.files || {};
			const fileList = Object.keys(files);

			if (fileList.length === 0) {
				throw new Error('El manifest no contiene archivos para verificar');
			}

			verificationState = 'verifying';
			verificationMessage = `Verificando ${fileList.length} archivos...`;
			verificationProgress = 20;

			console.log(`[INTEGRITY] Verificando ${fileList.length} archivos`);

			// Verificar cada archivo
			const totalFiles = fileList.length;
			let verifiedFiles = 0;
			const errors: string[] = [];

			for (const filePath of fileList) {
				const expectedHash = files[filePath];
				
				// Construir URL completa del archivo
				// El filePath ya viene sin /webgl/, así que lo agregamos
				const fileUrl = `${iframeSrc}/webgl/${filePath}`;
				
				try {
					console.log(`[INTEGRITY] Verificando: ${filePath}`);
					
					const { hash: calculatedHash } = await fetchAndHash(fileUrl);
					const expectedHashValue = expectedHash.replace('sha256-', '');

					if (calculatedHash !== expectedHashValue) {
						const error = `Hash mismatch para ${filePath}`;
						console.error(`[INTEGRITY] ${error}`);
						console.error(`  Esperado: ${expectedHashValue}`);
						console.error(`  Calculado: ${calculatedHash}`);
						errors.push(error);
					} else {
						console.log(`[INTEGRITY] ${filePath} verificado`);
					}

					verifiedFiles++;
					verificationProgress = 20 + Math.floor((verifiedFiles / totalFiles) * 70);
					verificationMessage = `Verificando archivo ${verifiedFiles}/${totalFiles}...`;
					
				} catch (err) {
					const error = `Error al verificar ${filePath}: ${err instanceof Error ? err.message : 'Unknown error'}`;
					console.error(`[INTEGRITY] ${error}`);
					errors.push(error);
				}
			}

			if (errors.length > 0) {
				verificationState = 'error';
				verificationMessage = `Falló la verificación de integridad: ${errors.length} archivo(s) con errores`;
				console.error('[INTEGRITY] Errores encontrados:', errors);
				return;
			}

			// Verificación exitosa
			verificationProgress = 100;
			verificationState = 'success';
			verificationMessage = 'Verificación completada exitosamente';
			console.log('[INTEGRITY] Todos los archivos verificados correctamente');
			
			// Mostrar el iframe después de un breve delay
			setTimeout(() => {
				showIframe = true;
			}, 500);

		} catch (err) {
			verificationState = 'error';
			verificationMessage = err instanceof Error ? err.message : 'Error desconocido';
			console.error('[INTEGRITY] Error crítico:', err);
		}
	}

	function onIframeLoad() {
		console.log('[PARENT] Unity WebGL iframe loaded');
	}

	function retryVerification() {
		verificationState = 'idle';
		verificationMessage = '';
		verificationProgress = 0;
		showIframe = false;
		verifyIntegrity();
	}

	// Iniciar verificación al montar el componente
	import { onMount } from 'svelte';
	onMount(() => {
		verifyIntegrity();
	});
</script>

<Navbar />

<main class="lobby">
	{#if !showIframe}
		<div class="verification-overlay">
			<div class="verification-card">
				<h2>Verificación de Seguridad</h2>
				
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
						<p class="error-detail">
							Los archivos del juego no pasaron la verificación de integridad.
							Esto podría indicar un problema de seguridad.
						</p>
						<button class="retry-button" on:click={retryVerification}>
							Reintentar Verificación
						</button>
					</div>
				{:else if verificationState === 'success'}
					<div class="success-container">
						<div class="success-icon"></div>
						<p class="success-message">Verificación completada</p>
						<p class="success-detail">Cargando juego...</p>
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
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
		border-top: 4px solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
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
		background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.retry-button:hover {
		background: #5568d3;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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