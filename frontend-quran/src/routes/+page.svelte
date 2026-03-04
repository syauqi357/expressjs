<script>
	import { onMount } from 'svelte';
	import surahListFallback from '$lib/data/surah.json';

	/** @typedef {Object} SurahItem
	 * @property {number} id
	 * @property {string} namaArab
	 * @property {string} namaLatin
	 * @property {string} namaIndo
	 * @property {number} jumlahAyat
	 * @property {string} tempatTurun
	 */

	/** @type {SurahItem[]} */
	let surahs = $state([]);

	onMount(async () => {
		try {
			// Try API first
			const response = await fetch('http://localhost:3000/api/surah');
			if (response.ok) {
				surahs = await response.json();
			} else {
				// Fallback to JSON if API fails
				surahs = surahListFallback;
			}
		} catch (error) {
			// Fallback to JSON if offline
			console.log('API unavailable, using offline data');
			surahs = surahListFallback;
		}
	});
</script>

<main class="min-h-screen bg-white p-3">
	<div class="mb-6">
		<h1 class="mb-4 text-3xl font-bold text-black">Daftar Surah Al-Quran</h1>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each surahs as surah}
				<a
					href="/surah/{surah.id}"
					class="block cursor-pointer rounded-lg border border-blue-300 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-sm"
				>
					<div class="mb-2 flex items-center justify-between">
						<span
							class="rounded border border-gray-300 bg-white px-2 py-1 text-sm font-bold text-black"
						>
							{surah.id}
						</span>
						<span class="text-xs text-gray-600">{surah.jumlahAyat} Ayat</span>
					</div>
					<h2 class="mb-1 text-lg font-bold text-black">{surah.namaLatin}</h2>
					<p class="mb-2 text-sm text-gray-700">{surah.namaIndo}</p>
					<div class="text-right font-serif text-3xl text-black" lang="ar" dir="rtl">
						{surah.namaArab}
					</div>
				</a>
			{/each}
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
