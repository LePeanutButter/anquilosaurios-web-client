<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolveRoute } from '$app/paths'; // 🔹 Agregado para resolver rutas

	onMount(() => {
		console.log('Navbar montada');
	});

	const menuItems = [
		{ name: 'Comunidad', href: '/comunidad' },
		{ name: 'Soporte', href: '/soporte' },
		{ name: 'Legal y Privacidad', href: '/legal' },
		{ name: 'Accesibilidad', href: '/accesibilidad' },
		{ name: 'Tienda', href: '/tienda' }
	];

	function navigateTo(href: string) {
		goto(resolveRoute(href as unknown as `/`));
	}
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
	<div class="container-fluid">
		<a class="navbar-brand fw-bold" href="/">POWER GARDEN: Juicy Brawl!</a>

		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#mainMenu"
			aria-controls="mainMenu"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="mainMenu">
			<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
				{#each menuItems as item (item.href)}
					<li class="nav-item">
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							class="nav-link"
							href={item.href}
							on:click|preventDefault={() => navigateTo(item.href)}
						>
							{item.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>

<style>
	.navbar {
		font-size: 1rem;
	}

	.nav-link {
		transition: color 0.3s ease;
	}

	.nav-link:hover {
		color: #ffc107;
	}
</style>
