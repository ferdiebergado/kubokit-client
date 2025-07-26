<script lang="ts">
	import { api } from '$lib/api';
	import { SubmitButton } from '$lib/components';
	import { routes } from '$lib/routes';
	import { appState } from '../../state.svelte';

	type FormData = {
		email: string;
		password: string;
		passwordConfirm: string;
	};

	type FormErrors = Partial<Omit<FormData, 'passwordConfirm'>> & { password_confirm?: string };

	const initialData: FormData = {
		email: '',
		password: '',
		passwordConfirm: ''
	};

	const initialErrors: FormErrors = {};

	let formData = $state(initialData);
	let formErrors = $state(initialErrors);
	let isSubmitting = $state(false);

	async function registerUser() {
		try {
			isSubmitting = true;

			const res = await api.post(routes.register, false, {
				email: formData.email,
				password: formData.password,
				password_confirm: formData.passwordConfirm
			});

			const payload = await res.json();

			console.log(payload);

			appState.msg = payload.message;

			if (!res.ok) {
				appState.success = false;
				if (payload.errors) {
					formErrors = payload.errors;
				}
			} else {
				appState.success = true;
				formData = initialData;
				formErrors = initialErrors;
			}
		} catch (error) {
			console.error(error);
			appState.msg = 'An unexpected error occurred.';
			appState.success = false;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="form-wrapper">
	<h2>Register</h2>

	<form onsubmit={registerUser}>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				class={formErrors['email'] ? 'error' : ''}
				bind:value={formData.email}
				required
				autocomplete="email"
			/>
			{#if formErrors['email']}
				<div class="help-text">{formErrors['email']}</div>
			{/if}
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" id="password" bind:value={formData.password} required />
		</div>

		<div class="form-group">
			<label for="password_confirm">Confirm Password</label>
			<input
				type="password"
				id="password_confirm"
				class={formErrors['password_confirm'] ? 'error' : ''}
				bind:value={formData.passwordConfirm}
				required
			/>
			{#if formErrors['password_confirm']}
				<div class="help-text">{formErrors['password_confirm']}</div>
			{/if}
		</div>

		<SubmitButton {isSubmitting}></SubmitButton>

		<p>Already have an account? <a href="/auth/login">Login</a></p>
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
		font-size: 1.6rem;
		text-transform: uppercase;
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
