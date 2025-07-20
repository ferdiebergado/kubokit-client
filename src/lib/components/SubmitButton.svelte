<script>
	const { isSubmitting } = $props();
</script>

<button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>

<style>
	button {
		width: 100%;
		padding: 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		font-size: 18px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: #0056b3;
	}

	button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
</style>
