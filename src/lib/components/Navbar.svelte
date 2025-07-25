<script lang="ts">
	import logo from '../../../static/inspiration.svg';
	import { page } from '$app/state';
	import { routes } from '$lib/routes';
	import { authState } from '../../routes/state.svelte';

	const { register, login, logout, users } = routes;
	let currentPath = $derived(page.url.pathname);
	let isLoggedIn = $derived(!!authState.user);
</script>

{#snippet navLink(text: string, path: string)}
	<a href={path} class={currentPath === path ? 'active' : ''} data-sveltekit-preload-data="false"
		>{text}</a
	>
{/snippet}

<header>
	<nav>
		<div>
			<a class="logo" href="/">
				<img src={logo} alt="logo" />
			</a>
			{#if isLoggedIn}
				{@render navLink('Dashboard', 'dashboard')}
				{@render navLink('Users', users)}
			{/if}
		</div>
		<div>
			{#if isLoggedIn}
				<span>Logged in as {authState.user!.email}</span>
				{@render navLink('Logout', logout)}
			{:else}
				{@render navLink('Register', register)}
				{@render navLink('Login', login)}
			{/if}
		</div>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
		align-items: center;
	}

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

	a:not(.logo) {
		color: black;
		margin: 0.6rem;
		padding: 0.75rem 1rem;
		border-radius: 0.3rem;
	}

	.active {
		font-weight: bold;
	}

	.logo {
		padding: 1rem;
		margin-inline: 1rem;
	}

	.logo img {
		width: 2.5rem;
		height: 2rem;
	}
</style>
