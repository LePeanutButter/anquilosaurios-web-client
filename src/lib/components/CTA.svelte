<!--
  @component CTA

  Renders a customizable call-to-action button.

  ## Props

  - `text` (string) – The label displayed on the button. Default: 'Play Now'
  - `onClick` (function) – Callback function triggered when the button is clicked. Default: empty function

  ## Usage
  
  <CTA text="Start Game" onClick={startGameHandler} />
-->
<script lang="ts">
	export let text = 'Play Now';
	export let onClick: () => void = () => {};

	function handleClick() {
		onClick();
	}
</script>

<button class="cta" on:click={handleClick}>
	{text}
</button>

<style>
	.cta {
		background: #0a84ff;
		color: #fff;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 10px;
		font-size: 1.1rem;
		cursor: pointer;
		transition:
			background 0.25s,
			transform 0.1s;
	}

	.cta:hover {
		background: #0066cc;
		transform: translateY(-2px);
	}

	.cta:active {
		transform: scale(0.98);
	}
</style>
