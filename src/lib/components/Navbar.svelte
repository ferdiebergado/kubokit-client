<script>
	import { page } from '$app/state';
	import { isLoggedIn, getUser } from '../../routes/state.svelte';

	let currentPath = $derived(page.url.pathname);
</script>

<nav>
	<div>
		<a href="/" class={currentPath == '/' ? 'active' : ''}>Home</a>
		{#if isLoggedIn()}
			<a
				data-sveltekit-preload-data={isLoggedIn() ? 'hover' : false}
				href="/users"
				class={currentPath == '/users' ? 'active' : ''}>Users</a
			>
		{/if}
	</div>
	<div>
		{#if isLoggedIn()}
			<span>Logged in as {getUser()?.email}</span><a
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
		align-items: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		width: 100%;
		overflow: hidden;
		margin-bottom: 3rem;
	}

	nav > div {
		display: flex;
		align-items: center;
		justify-content: center;
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
</style>
