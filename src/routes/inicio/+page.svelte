<script lang="ts">
	import ProtectedRoute from '$lib/components/ProtectedRoute.svelte';
	import PlayNow from '$lib/components/PlayNow.svelte';
</script>

<ProtectedRoute redirectTo="/">
	<PlayNow />
</ProtectedRoute>