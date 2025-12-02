<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '../authStore';

	export let redirectTo: string = '/login';
	export let requireAdmin: boolean = false;

	let isLoading = true;
	let isAuthorized = false;

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			isLoading = state.isLoading;

			if (!state.isAuthenticated) {
				goto(redirectTo);
				return;
			}

			if (requireAdmin && !state.user?.isAdmin) {
				goto('/');
				return;
			}

			isAuthorized = true;
			isLoading = false;
		});

		return unsubscribe;
	});
</script>

{#if isLoading}
	<div class="loading-container">
		<div class="spinner-large"></div>
		<p>Verificando autenticación...</p>
	</div>
{:else if isAuthorized}
	<slot />
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		gap: 20px;
		background: linear-gradient(180deg, #0a84ff 0%, #003d80 100%);
	}

	.spinner-large {
		width: 48px;
		height: 48px;
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	p {
		color: white;
		font-size: 14px;
	}
</style>
