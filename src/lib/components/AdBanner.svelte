<script lang="ts">
	export let altText: string = 'Publicidad del juego';
</script>

<style>
	.ad-banner {
		margin: 2rem auto;
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 900px;
	}

	img {
		width: 100%;
		border-radius: 10px;
		object-fit: cover;
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s;
	}

	img:hover {
		transform: scale(1.02);
	}
</style>
