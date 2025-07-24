<script lang="ts">
	import { page } from '$app/state';
	import { routes } from '$lib/routes';
	import { isLoggedIn, getUser } from '../../routes/state.svelte';

	const { register, login, logout, users } = routes;
	let currentPath = $derived(page.url.pathname);
</script>

{#snippet navLink(text: string, path: string)}
	<a href={path} class={currentPath === path ? 'active' : ''} data-sveltekit-preload-data="false"
		>{text}</a
	>
{/snippet}

<nav>
	<div>
		{@render navLink('Home', '/')}
		{#if isLoggedIn()}
			{@render navLink('Users', users)}
		{/if}
	</div>
	<div>
		{#if isLoggedIn()}
			<span>Logged in as {getUser()?.email}</span>
			{@render navLink('Logout', logout)}
		{:else}
			{@render navLink('Register', register)}
			{@render navLink('Login', login)}
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
