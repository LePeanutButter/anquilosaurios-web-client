<!--
  @component PlayNow

  Landing page for POWER GARDEN: Juicy Brawl! with hero section, advertisement, and call-to-action.

  ## Features

  - Displays a hero section with welcome message and game description.
  - Includes a CTA button to start the game.
  - Shows an AdBanner below the hero section.
  - Navbar and Footer are included for site navigation.
  - Once "Jugar Ahora" is clicked, the LobbyEmbed component is shown to start the game.

  ## Props

  None.

  ## Usage

  <PlayNow />
-->

<script lang="ts">
	import CTA from './CTA.svelte';
	import AdBanner from './AdBanner.svelte';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';
	import LobbyEmbed from './LobbyEmbed.svelte';

	let showGame = false;

	function handlePlayClick() {
		showGame = true;
	}
</script>

{#if showGame}
	<LobbyEmbed />
{:else}
	<Navbar />
	<main class="home">
		<section class="hero">
			<h1>Bienvenido a POWER GARDEN: Juicy Brawl!</h1>
			<p>Prepárate para vivir la experiencia definitiva del juego.</p>
			<CTA text="Jugar Ahora" onClick={handlePlayClick} />
		</section>

		<AdBanner />
	</main>
	<Footer />
{/if}

<style>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 100vh;
		background: linear-gradient(180deg, #0a84ff 0%, #003d80 100%);
		color: white;
		padding: 2rem;
	}

	.hero {
		margin-top: 4rem;
		max-width: 800px;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
	}
</style>
