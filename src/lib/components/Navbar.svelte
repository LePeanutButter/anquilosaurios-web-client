<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { resolveRoute } from '$app/paths';
	import { authService } from '$lib/authService';
	import { currentUser, isAuthenticated } from '$lib/authStore';

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

	async function handleLogout() {
		await authService.logout();
		goto('/');
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

				<!-- Auth section -->
				{#if $isAuthenticated && $currentUser}
					<li class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle user-menu"
							href="#"
							id="userDropdown"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<i class="bi bi-person-circle me-1"></i>
							{$currentUser.name}
						</a>
						<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
							<li>
								<span class="dropdown-item-text">
									<small class="text-muted">{$currentUser.email}</small>
								</span>
							</li>
							<li><hr class="dropdown-divider" /></li>
							<li>
								<a class="dropdown-item" href="/cuenta">
									<i class="bi bi-gear me-2"></i>Mi Cuenta
								</a>
							</li>
							{#if $currentUser.isAdmin}
								<li>
									<a class="dropdown-item" href="/admin">
										<i class="bi bi-shield-lock me-2"></i>Panel Admin
									</a>
								</li>
							{/if}
							<li><hr class="dropdown-divider" /></li>
							<li>
								<button class="dropdown-item text-danger" on:click={handleLogout}>
									<i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
								</button>
							</li>
						</ul>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link btn btn-outline-light btn-sm px-3 ms-2" href="/">
							Iniciar Sesión
						</a>
					</li>
				{/if}
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

	.user-menu {
		color: #ffc107 !important;
		font-weight: 500;
	}

	.dropdown-item {
		cursor: pointer;
	}

	.dropdown-item:active {
		background-color: #0d6efd;
	}

	.dropdown-item.text-danger:hover {
		background-color: #dc3545;
		color: white !important;
	}

	/* Estilos para el botón de login cuando no está autenticado */
	.btn-outline-light {
		border-color: #ffc107;
		color: #ffc107;
	}

	.btn-outline-light:hover {
		background-color: #ffc107;
		color: #000;
		border-color: #ffc107;
	}
</style>