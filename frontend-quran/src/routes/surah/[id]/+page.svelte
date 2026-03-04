<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	interface Verse {
		namaLatin: string;
		namaArab: string;
		namaIndo: string;
		tempatTurun: string;
		verseID: number;
		ayahText: string;
		readText: string;
		indoText: string;
	}

	let surahData: Verse[] = $state([]);
	let copiedVerses: Record<number, boolean> = $state({});
	let surahTitle: string = $state('');
	let loading: boolean = $state(true);
	let searchQuery: string = $state('');

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

	function handleCopy(verse: Verse): void {
		const fullText = `${verse.ayahText}\n\n${verse.readText}\n\n${verse.indoText}`;
		navigator.clipboard.writeText(fullText);

		copiedVerses[verse.verseID] = true;

		setTimeout(() => {
			copiedVerses[verse.verseID] = false;
		}, 1000);
	}

	function getFilteredVerses(): Verse[] {
		if (!searchQuery.trim()) return surahData;
		const query: string = searchQuery.toLowerCase().trim();
		return surahData.filter((verse) => verse.verseID.toString().includes(query));
	}
</script>

<main class="min-h-screen bg-white p-3">
	<div class="mb-6">
		<a
			href="/"
			class="mb-4 inline-block rounded border-2 border-blue-500 bg-blue-500 px-4 py-2 text-blue-50 transition-all hover:border-blue-600 hover:shadow-md"
		>
			Kembali ke Daftar Surah
		</a>
		{#if surahData.length > 0}
			<h1 class="text-3xl font-bold text-black">{surahTitle}</h1>
			<div class="mt-2 text-black">
				<p>{surahData[0].namaArab}</p>
				<p>{surahData[0].namaIndo}</p>
				<p class="text-sm text-gray-600">{surahData[0].tempatTurun}</p>
			</div>
		{/if}

		{#if !loading}
			<div class="mt-4">
				<input
					type="text"
					placeholder="Cari ayat nomor (contoh: 1, 5, 10)..."
					value={searchQuery}
					oninput={(e) => {
						if (e.target instanceof HTMLInputElement) {
							searchQuery = e.target.value.replace(/[^0-9]/g, '');
						}
					}}
					pattern="[0-9]*"
					class="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
				/>
				{#if getFilteredVerses().length === 0 && searchQuery.trim()}
					<p class="mt-2 text-sm text-gray-500">Tidak ada ayat dengan nomor "{searchQuery}"</p>
				{/if}
			</div>
		{/if}
	</div>

	{#if loading}
		<div class="text-center text-gray-500">Loading...</div>
	{:else if surahData.length === 0}
		<div class="text-center text-gray-500">Tidak ada data ayat</div>
	{:else}
		{#each getFilteredVerses() as verse}
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
						class="mb-4 border-b border-gray-300 py-2 text-right font-serif text-3xl/16 text-black"
						lang='ar'
						dir='rtl'
					>
						{verse.ayahText}
					</div>
					<div class="text-black">
						<p class="mb-3 text-sm text-gray-600 italic">{verse.readText}</p>
						<p lang="id" class="text-gray-800">{verse.indoText}</p>
					</div>
				</section>
			</div>
		{/each}
	{/if}
</main>
