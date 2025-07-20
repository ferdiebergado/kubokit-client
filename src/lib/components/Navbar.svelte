<script>
	import { page } from '$app/state';
	import { authState } from '../../routes/state.svelte';

	let currentPath = $derived(page.url.pathname);
</script>

<nav>
	<div class="left-item">
		<a href="/" class={currentPath == '/' ? 'active' : ''}>Home</a>
		{#if authState.isAuthenticated}
			<a
				data-sveltekit-preload-data={authState.isAuthenticated ? 'hover' : false}
				href="/users"
				class={currentPath == '/users' ? 'active' : ''}>Users</a
			>
		{/if}
	</div>
	<div class="right-item">
		{#if authState.isAuthenticated}
			<a data-sveltekit-preload-data="false" href="/auth/logout">Logout</a>
		{:else}
			<a href="/auth/register" class={currentPath == '/auth/register' ? 'active' : ''}>Register</a>
			<a
				data-sveltekit-preload-data="false"
				href="/auth/login"
				class={currentPath == '/auth/login' ? 'active' : ''}>Login</a
			>
		{/if}
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		width: 100%;
		overflow: hidden;
		margin-bottom: 3rem;
	}

	a {
		color: black;
		text-decoration: none;
		margin: 0.6rem;
		padding: 0.75rem 1rem;
		border-radius: 0.3rem;
	}

	a:hover:not(.active) {
		background-color: lightgrey;
	}

	.active {
		background-color: slategrey;
		color: white;
	}

	.left-item {
		display: flex;
	}

	.right-item {
		display: flex;
	}
</style>
