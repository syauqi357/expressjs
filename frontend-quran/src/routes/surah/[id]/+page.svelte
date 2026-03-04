<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	/** @typedef {Object} Verse
	 * @property {string} namaLatin
	 * @property {number} verseID
	 * @property {string} ayahText
	 * @property {string} readText
	 * @property {string} indoText
	 */

	/** @type {Verse[]} */
	let surahData = $state([]);

	/** @type {Object<number, boolean>} */
	let copiedVerses = $state({});

	/** @type {string} */
	let surahTitle = $state('');

	/** @type {boolean} */
	let loading = $state(true);

	onMount(async () => {
		try {
			const surahId = $page.params.id;

			// Try API first
			try {
				const response = await fetch(`http://localhost:3000/api/surah/${surahId}`);
				if (response.ok) {
					surahData = await response.json();
					if (surahData.length > 0) {
						surahTitle = surahData[0].namaLatin;
					}
				} else {
					throw new Error('API returned non-ok status');
				}
			} catch (apiError) {
				// Fallback to JSON if API fails
				console.log('API unavailable, loading from lib...');
				try {
					const ayatData = await import(`$lib/data/ayat/${surahId}.json`);
					surahData = ayatData.default;
					if (surahData.length > 0) {
						surahTitle = surahData[0].namaLatin;
					}
				} catch (importError) {
					console.error('Data not found:', importError);
				}
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	});

	/**
	 * @param {Verse} verse
	 */
	function handleCopy(verse) {
		const fullText = `${verse.ayahText}\n\n${verse.readText}\n\n${verse.indoText}`;
		navigator.clipboard.writeText(fullText);

		copiedVerses[verse.verseID] = true;

		setTimeout(() => {
			copiedVerses[verse.verseID] = false;
		}, 1000);
	}
</script>

<main class="min-h-screen bg-white p-3">
	<div class="mb-6">
		<a
			href="/"
			class="mb-4 inline-block rounded border border-gray-300 bg-white px-4 py-2 text-black transition-all hover:border-gray-500 hover:shadow-md"
		>
			← Kembali ke Daftar Surah
		</a>
		{#if surahTitle}
			<h1 class="text-3xl font-bold text-black">{surahTitle}</h1>
		{/if}
	</div>

	{#if loading}
		<div class="text-center text-gray-500">Loading...</div>
	{:else if surahData.length === 0}
		<div class="text-center text-gray-500">Tidak ada data ayat</div>
	{:else}
		{#each surahData as verse}
			<div class="mb-4 overflow-hidden rounded-md border border-gray-300 bg-white">
				<!-- upper head -->
				<div class="flex items-center justify-between gap-3 border-b border-gray-300 p-4">
					<span class="font-bold text-black"> {verse.namaLatin} - Ayat {verse.verseID} </span>
					<button
						class="flex items-center justify-center rounded border border-gray-300 bg-white px-3 py-1.5 text-black transition-all hover:border-gray-500 hover:shadow-md"
						onclick={() => handleCopy(verse)}
					>
						{#if copiedVerses[verse.verseID]}
							copied
						{:else}
							copy
						{/if}
					</button>
				</div>
				<!-- content -->
				<section class="bg-white p-4">
					<div
						class="mb-4 border-b border-gray-300 py-2 text-right font-serif text-3xl text-black"
						lang="ar"
						dir="rtl"
					>
						{verse.ayahText}
					</div>
					<div class="text-black">
						<p class="mb-1 text-sm italic text-gray-700">{verse.readText}</p>
						<p lang="id" class="text-gray-800">{verse.indoText}</p>
					</div>
				</section>
			</div>
		{/each}
	{/if}
</main>
