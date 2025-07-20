<script lang="ts">
	import { Alert, SubmitButton } from '$lib/components';

	type FormData = {
		email: string;
		password: string;
		passwordConfirm: string;
	};

	type FormErrors = {
		email: string;
		password: string;
		password_confirm: string;
	};

	const initialData: FormData = {
		email: '',
		password: '',
		passwordConfirm: ''
	};

	const initialErrors: FormErrors = {
		email: '',
		password: '',
		password_confirm: ''
	};

	let formData = $state(initialData);
	let formErrors = $state(initialErrors);
	let isSubmitting = $state(false);

	let alertMsg = $state('');
	let alertClass = $state('');

	async function registerUser() {
		try {
			isSubmitting = true;

			const res = await fetch('http://127.0.0.1:8888/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					password_confirm: formData.passwordConfirm
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
				formData = initialData;
				formErrors = initialErrors;
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
