<!--
  @component HomePage

  Landing page for the application.

  ## Features

  - Renders the `PlayNow` component, which contains the hero section, CTA, banner, and game embed logic.

  ## Props

  None.

  ## Usage

  This component is mapped to the root route (`/`) by SvelteKit.
-->
<script lang="ts">
	import PlayNow from '../lib/components/PlayNow.svelte';
</script>

<PlayNow />
