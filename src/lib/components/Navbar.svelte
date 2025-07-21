<script>
	import { page } from '$app/state';
	import { user } from '../../routes/state.svelte';

	let currentPath = $derived(page.url.pathname);
</script>

<nav>
	<div class="left-items">
		<a href="/" class={currentPath == '/' ? 'active' : ''}>Home</a>
		{#if user.isAuthenticated}
			<a
				data-sveltekit-preload-data={user.isAuthenticated ? 'hover' : false}
				href="/users"
				class={currentPath == '/users' ? 'active' : ''}>Users</a
			>
		{/if}
	</div>
	<div class="right-items">
		{#if user.isAuthenticated}
			<span>Logged in as {user.email}</span><a
				data-sveltekit-preload-data="false"
				href="/auth/logout">Logout</a
			>
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
		margin: 0.6rem;
		padding: 0.75rem 1rem;
		border-radius: 0.3rem;
	}

	.active {
		font-weight: bold;
	}

	.left-items {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.right-items {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
