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
			aria-label="kembali"
			class="mb-8 flex w-fit items-center justify-center gap-3 py-2 text-slate-500 transition-all hover:text-slate-700"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 0 24 24"
				width="24px"
				fill="currentColor"
				><path d="M0 0h24v24H0z" fill="none" /><path
					d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
				/></svg
			>
			<p>Kembali ke Daftar Surah</p>
		</a>
		{#if surahData.length > 0}
			<div>
				<h1 class="text-4xl font-bold text-emerald-700">{surahTitle}</h1>
				<div class="my-4 flex items-center gap-3 text-black">
					<span lang="ar" class="text-3xl font-semibold">{surahData[0].namaArab}</span>
					-
					<span class="rounded-md bg-gray-200 px-3 py-1 text-lg font-semibold"
						>{surahData[0].namaIndo}</span
					>
				</div>
				<p
					class="text-md w-fit cursor-pointer rounded-md px-3 py-1.5 text-gray-600 transition-all ease-in-out hover:bg-gray-100 hover:text-gray-800"
				>
					{surahData[0].tempatTurun}
				</p>
			</div>
		{/if}

		{#if !loading}
			<div class="mt-4">
				<input
					type="text"
					placeholder="Cari nomor ayat (contoh: 1, 5, 10)..."
					value={searchQuery}
					oninput={(e) => {
						if (e.target instanceof HTMLInputElement) {
							searchQuery = e.target.value.replace(/[^0-9]/g, '');
						}
					}}
					pattern="[0-9]*"
					class="w-full rounded-md border-2 border-gray-300 px-3 py-2 text-black placeholder-gray-500 transition-all ease-in-out focus:border-blue-500 focus:outline-none"
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
						class="text-blue flex items-center justify-center rounded border border-gray-300 bg-slate-50 px-3 py-1.5 transition-all hover:border-gray-300 hover:bg-slate-100"
						onclick={() => handleCopy(verse)}
					>
						{#if copiedVerses[verse.verseID]}
							<div class="flex items-center justify-center gap-1 text-green-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 0 24 24"
									width="24px"
									fill="currentColor"
									><path d="M0 0h24v24H0z" fill="none" /><path
										d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
									/></svg
								>
								<span>copied</span>
							</div>
						{:else}
							<div class="flex items-center justify-center gap-2 text-slate-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									enable-background="new 0 0 24 24"
									height="24px"
									viewBox="0 0 24 24"
									width="24px"
									fill="currentColor"
									><g><rect fill="none" height="24" width="24" /></g><g
										><path
											d="M15,20H5V7c0-0.55-0.45-1-1-1h0C3.45,6,3,6.45,3,7v13c0,1.1,0.9,2,2,2h10c0.55,0,1-0.45,1-1v0C16,20.45,15.55,20,15,20z M20,16V4c0-1.1-0.9-2-2-2H9C7.9,2,7,2.9,7,4v12c0,1.1,0.9,2,2,2h9C19.1,18,20,17.1,20,16z M18,16H9V4h9V16z"
										/></g
									></svg
								>
								<span>copy</span>
							</div>
						{/if}
					</button>
				</div>
				<!-- content -->
				<section class="bg-white p-4">
					<div
						class="mb-4 border-b border-gray-300 py-2 text-right font-serif text-3xl/16 text-black"
						lang="ar"
						dir="rtl"
					>
						{verse.ayahText}
					</div>
					<div class="text-black">
						<p class="mb-3 text-sm text-blue-400 italic">{verse.readText}</p>
						<p lang="id" class="text-gray-800">{verse.indoText}</p>
					</div>
				</section>
			</div>
		{/each}
	{/if}
</main>
