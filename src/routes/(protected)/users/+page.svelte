<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Users</title>
	<meta name="description" content="List of users" />
</svelte:head>

<section>
	<h1>Users</h1>

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
			{#each data.users as user (user.id)}
				<tr>
					<td>{user.id}</td>
					<td>{user.email}</td>
					<td>{user.created_at}</td>
					<td>{user.updated_at}</td>
				</tr>
			{:else}
				<tr><td colspan="4">No data.</td></tr>
			{/each}
		</tbody>
	</table>
</section>

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
