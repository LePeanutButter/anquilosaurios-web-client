<!--
  @component Footer

  Renders the site footer with copyright information and link buttons.

  ## Features

  - Displays the current year automatically.
  - Includes buttons for Términos, Privacidad, and Contacto.
  - Styled with centered layout and hover effects for links.

  ## Usage

  <Footer />
-->
  
<script lang="ts">
	let currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<p>© {currentYear} POWER GARDEN: Juicy Brawl!. Todos los derechos reservados.</p>
	<div class="links">
		<button class="link-btn">Términos</button>
		<button class="link-btn">Privacidad</button>
		<button class="link-btn">Contacto</button>
	</div>
</footer>

<style>
	.footer {
		background: #001f3f;
		color: #ccc;
		text-align: center;
		padding: 1.5rem 0;
		margin-top: auto;
	}

	.links {
		margin-top: 0.5rem;
		display: flex;
		justify-content: center;
		gap: 1.5rem;
	}

	.link-btn {
		background: none;
		border: none;
		color: #ccc;
		font: inherit;
		cursor: pointer;
		text-decoration: none;
		transition: color 0.2s;
	}

	.link-btn:hover {
		color: #0a84ff;
	}
</style>
