<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/authStore';

	// Si ya está autenticado, redirigir a /inicio
	onMount(() => {
		const unsubscribe = isAuthenticated.subscribe(authenticated => {
			if (authenticated) {
				goto('/inicio');
			}
		});

		return unsubscribe;
	});
</script>

<AuthForm />