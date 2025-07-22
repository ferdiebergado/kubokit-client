<script lang="ts">
	import { goto } from '$app/navigation';
	import { Alert, SubmitButton } from '$lib/components';
	import { authClient, setUser, targetURL } from '../../state.svelte';

	type FormData = {
		email: string;
		password: string;
	};

	type FormErrors = {
		email: string;
		password: string;
	};

	const initialData: FormData = {
		email: '',
		password: ''
	};

	const initialErrors: FormErrors = {
		email: '',
		password: ''
	};

	let formData = $state(initialData);
	let formErrors = $state(initialErrors);

	let isSubmitting = $state(false);
	let alertMsg = $state('');
	let alertClass = $state('');

	async function loginUser(): Promise<void> {
		try {
			isSubmitting = true;

			const res = await fetch('http://127.0.0.1:8888/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password
				})
			});

			const data = await res.json();

			console.log(data);

			alertMsg = data.message;

			if (!res.ok) {
				alertClass = 'error';
				if (data.errors) {
					formErrors = data.errors;
				}
			} else {
				alertClass = 'success';
				const { access_token, expires_in } = data.data;
				authClient.setToken(access_token);
				authClient.setTokenExpiry(expires_in);
				setUser({ email: formData.email });

				const redirectURL = targetURL.path;
				console.log('targeturl', redirectURL);
				targetURL.path = '/';
				await goto(redirectURL);
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
		padding-top: 0.3rem;
		font-size: medium;
		color: red;
	}
</style>
