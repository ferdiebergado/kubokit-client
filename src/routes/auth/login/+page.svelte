<script lang="ts">
	import { goto } from '$app/navigation';
	import { api, jsonFetch, originalFetch, type APIResponse } from '$lib';
	import type { AuthData } from '$lib/features/auth';
	import { Alert, SubmitButton } from '$lib/components';
	import { routes } from '$lib/routes';
	import { authClient, setUser, intendedURL } from '../../state.svelte';

	type FormData = {
		email: string;
		password: string;
	};

	type FormErrors = {
		email?: string;
		password?: string;
	};

	const initialData: FormData = {
		email: '',
		password: ''
	};

	const initialErrors: FormErrors = {};

	let formData = $state(initialData);
	let formErrors = $state(initialErrors);

	let isSubmitting = $state(false);
	let alertMsg = $state('');
	let alertClass = $state('');
	let isVerified = $state(false);

	async function loginUser(): Promise<void> {
		try {
			isSubmitting = true;

			const res = await jsonFetch(
				api + routes.login,
				{
					method: 'POST'
				},
				{
					email: formData.email,
					password: formData.password
				}
			);

			const payload: APIResponse<AuthData, FormErrors> = await res.json();
			console.log(payload);

			const { message, data, errors } = payload;

			alertMsg = message;

			if (!res.ok) {
				alertClass = 'error';
				if (errors) {
					formErrors = errors;
					const { error_code } = errors;
					if (error_code && error_code === 'ACCOUNT_NOT_VERIFIED') {
						isVerified = false;
					}
				}
			} else {
				alertClass = 'success';
				if (data) {
					authClient.setData(data);
					setUser({ email: formData.email });
					isVerified = true;
					const redirectURL = intendedURL.path;
					intendedURL.path = '/';
					await goto(redirectURL);
				}
			}
		} catch (error) {
			console.error(error);
			alertClass = 'error';
			alertMsg = 'An unexpected error occurred.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if alertMsg}
	<Alert message={alertMsg} cls={alertClass}></Alert>
	{#if !isVerified}
		<p class="info">
			Please check your email or <a href="/auth/resend">resend</a> a verification.
		</p>
	{/if}
{/if}

<div class="form-wrapper">
	<h2>Login</h2>

	<form onsubmit={loginUser}>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				class={formErrors['email'] ? 'error' : ''}
				bind:value={formData.email}
				required
			/>
			{#if formErrors['email']}
				<div class="help-text">{formErrors['email']}</div>
			{/if}
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" id="password" bind:value={formData.password} required />
		</div>

		<SubmitButton {isSubmitting}></SubmitButton>

		<p>Do not have an account? <a href="/auth/register">Register</a></p>
	</form>
</div>

<style>
	.form-wrapper {
		flex: 1;
		width: 50%;
		max-width: 400px;
		padding: 30px;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		background-color: #fff;
	}

	h2 {
		text-align: center;
		color: #333;
		margin-bottom: 25px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 8px;
		font-weight: bold;
		color: #555;
	}

	input[type='email'],
	input[type='password'] {
		width: 100%;
		padding: 12px 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		box-sizing: border-box;
	}

	input[type='email']:focus,
	input[type='password']:focus {
		border-color: #007bff;
		outline: none;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
	}

	.error {
		border: 1px solid red;
	}

	.help-text {
		padding-top: 0.4rem;
		font-size: medium;
		color: red;
	}

	p {
		margin: 1rem;
	}

	.info {
		margin-bottom: 2rem;
	}
</style>
