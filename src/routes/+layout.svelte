<script lang="ts">
	import '../styles/global.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { appState } from './state.svelte';
	import { Alert } from '$lib/components';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	let msg = $derived(appState.msg);
	let cls = $derived(appState.success ? 'success' : 'error');
</script>

<Navbar />

{#if msg}
	<Alert message={msg} {cls}></Alert>
{/if}

{@render children()}
