<script>
	import { onMount } from 'svelte';
	import surahList from '../../../src/data/surah.json';

   /** @typedef {Object} SurahItem
	 * @property {number} id
	 * @property {string} namaArab
	 * @property {string} namaLatin
	 * @property {string} namaIndo
	 * @property {number} jumlahAyat
	 * @property {string} tempatTurun
	 */

	/** @type {SurahItem[]} */
	let surahs = $state(surahList);
</script>

<main class="min-h-screen bg-slate-100 p-3">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-slate-800 mb-4">Daftar Surah Al-Quran</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
			{#each surahs as surah}
				<a
					href="/surah/{surah.id}"
					class="block p-4 bg-white rounded-lg border-l-4 border-blue-500 hover:shadow-lg hover:border-blue-600 transition-all cursor-pointer"
				>
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded">
							{surah.id}
						</span>
						<span class="text-xs text-slate-500">{surah.jumlahAyat} Ayat</span>
					</div>
					<h2 class="text-lg font-bold text-slate-800 mb-1">{surah.namaLatin}</h2>
					<p class="text-slate-600 text-sm mb-2">{surah.namaIndo}</p>
					<div class="text-right text-xl font-serif text-slate-700" lang="ar" dir="rtl">
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
