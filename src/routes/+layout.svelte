<script lang="ts">
	import '../app.css';
	import Alert from './Alert.svelte';
	import Header from './Header.svelte';
	import { appState } from './state.svelte';

	let { children } = $props();
	let msg = $derived(appState.msg);
	let cls = $derived(appState.success ? 'success' : 'error');
</script>

<div class="app">
	<Header />

	<main>
		{#if msg}
			<Alert message={msg} {cls}></Alert>
		{/if}

		{@render children()}
	</main>

	<footer>
		<p>&copy; Copyright 2025.</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
