<!--
  @component Layout

  Root layout component for the SvelteKit app.

  ## Features

  - Sets the favicon for the entire application.
  - Renders child routes via the `children` prop.

  ## Props

  - `children` – The child components or routes rendered inside the layout.

  ## Usage

  Used automatically by SvelteKit as the root layout. No manual instantiation required.
-->
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
