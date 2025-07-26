<script lang="ts">
	import { page } from '$app/state';
</script>

<div>
	<h1>{page.status}: {page.error?.message}</h1>
</div>

<style>
	h1 {
		color: lightgrey;
		font-size: 3.2rem;
	}

	div {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 254px);
	}
</style>
