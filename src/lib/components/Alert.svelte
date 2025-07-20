<script lang="ts">
	import { fade } from 'svelte/transition';

	let { message, cls } = $props();
</script>

<div class="alert {cls}" transition:fade>{message}</div>

<style>
	.alert {
		padding: 1rem;
		border-radius: 5px;
		max-width: 400px;
		width: 100%;
		margin: 1.5rem auto;
		font-family: Arial, Helvetica, sans-serif;
	}

	.error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}
</style>
