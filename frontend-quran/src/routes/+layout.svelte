<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="mx-auto w-full max-w-6xl px-4 py-6">
	{@render children()}
</main>
