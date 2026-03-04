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
			
			// Try to load from JSON first (offline)
			try {
				const ayatModule = await import(`../../../src/data/ayat/${surahId}.json`);
				surahData = ayatModule.default;
				if (surahData.length > 0) {
					surahTitle = surahData[0].namaLatin;
				}
			} catch (error) {
				// Fallback to API if JSON not found
				console.log('JSON not found, falling back to API...');
				const response = await fetch(`http://localhost:3000/api/surah/${surahId}`);
				if (response.ok) {
					surahData = await response.json();
					if (surahData.length > 0) {
						surahTitle = surahData[0].namaLatin;
					}
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
		}, 2000);
	}
</script>

<main class="min-h-screen bg-slate-100 p-3">
	<div class="mb-6">
		<a href="/" class="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
			← Kembali ke Daftar Surah
		</a>
		{#if surahTitle}
			<h1 class="text-3xl font-bold text-slate-800">{surahTitle}</h1>
		{/if}
	</div>

	{#if loading}
		<div class="text-center text-slate-500">Loading...</div>
	{:else if surahData.length === 0}
		<div class="text-center text-slate-500">Tidak ada data ayat</div>
	{:else}
		{#each surahData as verse}
			<div class="bg-slate-100 mb-4 rounded-md overflow-hidden">
				<!-- upper head -->
				<div class="flex items-center justify-between gap-3 bg-blue-300 p-4">
					<span class="font-bold"> {verse.namaLatin} - Ayat {verse.verseID} </span>
					<button
						class="flex items-center justify-center bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
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
				<section class="bg-slate-300 p-4">
					<div class="mb-4 text-right text-2xl font-serif border-b border-slate-400 pb-2" lang="ar" dir="rtl">
						{verse.ayahText}
					</div>
					<div class="text-slate-800">
						<p class="mb-1 italic text-sm">{verse.readText}</p>
						<p lang="id">{verse.indoText}</p>
					</div>
				</section>
			</div>
		{/each}
	{/if}
</main>
