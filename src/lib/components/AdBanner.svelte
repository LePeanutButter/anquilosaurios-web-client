<!--
  @component AdBanner

  Renders a simple advertisement banner with an image.

  ## Props

  - `altText` (string) – Alternative text for the image. Default: `'Publicidad del juego'`

  ## Example
  
  <AdBanner altText="Banner promocional" />
-->

<script lang="ts">
	export let altText: string = 'Publicidad del juego';
</script>

<div class="ad-banner">
	<img src="/banner.jpg" alt={altText} />
</div>

<style>
	.ad-banner {
		margin: 2rem auto;
		text-align: center;
	}

	img {
		width: 100%;
		border-radius: 8px;
		transition: transform 0.3s ease;
	}

	img:hover {
		transform: scale(1.02);
	}
</style>
