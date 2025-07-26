<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex-wrapper">
	{@render children()}
</div>

<style>
	.flex-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
