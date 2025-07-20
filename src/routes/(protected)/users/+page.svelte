<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h2>Users</h2>

<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Email</th>
			<th>Created At</th>
			<th>Updated At</th>
		</tr>
	</thead>
	<tbody>
		{#if data.users.length == 0}
			<tr><td colspan="4">No data</td></tr>
		{:else}
			{#each data.users as user}
				<tr>
					<td>{user.id}</td>
					<td>{user.email}</td>
					<td>{user.created_at}</td>
					<td>{user.updated_at}</td>
				</tr>
			{/each}
		{/if}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
	}

	th {
		font-weight: bold;
	}

	th,
	td {
		padding: 1rem;
		border: 1px solid black;
	}
</style>
