<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import IconMusic from '~icons/mdi/music';
	import IconBook from '~icons/mdi/book';
	import IconCalendar from '~icons/mdi/calendar';
	import IconMenu from '~icons/mdi/menu';
	import IconChevronLeft from '~icons/mdi/chevron-left';
	import ScoreViewer from '$lib/components/score/ScoreViewer.svelte';
	import TagBadge from '$lib/components/score/TagBadge.svelte';
	import type { Score } from '$lib/types';

	const scoreDetails: Score = {
		id: $page.params.id,
		title: 'Alle psallite cum luya',
		composer: 'Anonymous',
		dateComposed: '13th century',
		genre: 'Motet',
		source: 'Montpellier Codex',
		notation: 'Mensural',
		voices: 3,
		language: 'Latin',
		instruments: ['Voice'],
		description:
			'A three-voice Latin motet from the Montpellier Codex, featuring hocket technique.',
		transcribedBy: 'Dr. Jane Smith',
		transcriptionDate: '2022-03-15',
		lastModified: '2023-06-15',
		tags: ['motet', '13th century', 'Montpellier Codex', 'hocket'],
		thumbnailUrl:
			'https://images.unsplash.com/photo-1553184570-557b84a3a308?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzY2NTF8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop',
		meiData: `
<?xml version="1.0" encoding="UTF-8"?>
<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="4.0.0">
  <meiHead>
    <fileDesc>
      <titleStmt>
        <title>Alle psallite cum luya</title>
        <composer>Anonymous</composer>
      </titleStmt>
      <pubStmt>
        <date>13th century</date>
      </pubStmt>
    </fileDesc>
  </meiHead>
  <music>
    <body>
      <mdiv>
        <score>
          <scoreDef>
            <staffGrp>
              <staffDef n="1" lines="5" clef.shape="C" clef.line="3"/>
              <staffDef n="2" lines="5" clef.shape="C" clef.line="4"/>
              <staffDef n="3" lines="5" clef.shape="F" clef.line="4"/>
            </staffGrp>
          </scoreDef>
          <section>
            <measure n="1">
              <staff n="1">
                <layer n="1">
                  <note pname="c" oct="4" dur="4"/>
                  <note pname="d" oct="4" dur="4"/>
                  <note pname="e" oct="4" dur="4"/>
                  <note pname="f" oct="4" dur="4"/>
                </layer>
              </staff>
              <staff n="2">
                <layer n="1">
                  <note pname="a" oct="3" dur="2"/>
                  <note pname="b" oct="3" dur="2"/>
                </layer>
              </staff>
              <staff n="3">
                <layer n="1">
                  <note pname="f" oct="3" dur="1"/>
                </layer>
              </staff>
            </measure>
            <measure n="2">
              <staff n="1">
                <layer n="1">
                  <note pname="g" oct="4" dur="4"/>
                  <note pname="a" oct="4" dur="4"/>
                  <note pname="g" oct="4" dur="4"/>
                  <note pname="f" oct="4" dur="4"/>
                </layer>
              </staff>
              <staff n="2">
                <layer n="1">
                  <note pname="c" oct="4" dur="2"/>
                  <note pname="d" oct="4" dur="2"/>
                </layer>
              </staff>
              <staff n="3">
                <layer n="1">
                  <note pname="c" oct="3" dur="1"/>
                </layer>
              </staff>
            </measure>
          </section>
        </score>
      </mdiv>
    </body>
  </music>
</mei>
      `
	};

	let isDetailsVisible = true;

	function toggleDetails() {
		isDetailsVisible = !isDetailsVisible;
	}

	function goBackToBrowse() {
		goto('/browse');
	}
</script>

<div class="flex flex-col h-screen">
	<div class="flex-1 flex overflow-hidden">
		<div
			class="fixed left-0 w-80 bg-surface-100-800-token overflow-y-auto transition-transform duration-300 ease-in-out {isDetailsVisible
				? 'translate-x-0'
				: '-translate-x-full'} z-10"
			style="top: 64px; height: calc(100vh - 64px);"
		>
			<div class="p-4">
				<div class="flex justify-between items-center mb-4">
					<h2 class="h3">Score Details</h2>
					<button class="btn variant-soft-primary p-2" on:click={toggleDetails}>
						<IconChevronLeft />
						<span class="ml-2">Hide Details</span>
					</button>
				</div>
				<img
					src={scoreDetails.thumbnailUrl}
					alt={scoreDetails.title}
					class="w-full max-w-md mx-auto aspect-square object-cover rounded-lg shadow-lg mb-4"
				/>

				<div class="card variant-soft p-4 mb-4">
					<h3 class="h4 mb-2 flex items-center">
						<IconMusic class="mr-2" />
						Musical Details
					</h3>
					<dl class="grid grid-cols-2 gap-x-2 gap-y-1">
						<dt class="font-semibold">Genre</dt>
						<dd>{scoreDetails.genre}</dd>
						<dt class="font-semibold">Voices</dt>
						<dd>{scoreDetails.voices}</dd>
						<dt class="font-semibold">Instruments</dt>
						<dd>{scoreDetails.instruments.join(', ')}</dd>
						<dt class="font-semibold">Notation</dt>
						<dd>{scoreDetails.notation}</dd>
						<dt class="font-semibold">Language</dt>
						<dd>{scoreDetails.language}</dd>
					</dl>
				</div>

				<div class="card variant-soft p-4 mb-4">
					<h3 class="h4 mb-2 flex items-center">
						<IconBook class="mr-2" />
						Source Information
					</h3>
					<dl class="grid grid-cols-2 gap-x-2 gap-y-1">
						<dt class="font-semibold">Source</dt>
						<dd>{scoreDetails.source}</dd>
					</dl>
				</div>

				<div class="card variant-soft p-4 mb-4">
					<h3 class="h4 mb-2 flex items-center">
						<IconCalendar class="mr-2" />
						Transcription Details
					</h3>
					<dl class="grid grid-cols-2 gap-x-2 gap-y-1">
						<dt class="font-semibold">Transcribed By</dt>
						<dd>{scoreDetails.transcribedBy}</dd>
						<dt class="font-semibold">Transcription Date</dt>
						<dd>{scoreDetails.transcriptionDate}</dd>
						<dt class="font-semibold">Last Modified</dt>
						<dd>{scoreDetails.lastModified}</dd>
					</dl>
				</div>

				<div class="mb-4">
					<h3 class="h4 mb-2">Description</h3>
					<p class="text-surface-700-200-token">{scoreDetails.description}</p>
				</div>

				<div class="flex flex-wrap gap-2 mb-4">
					{#if scoreDetails.tags && scoreDetails.tags.length > 0}
						{#each scoreDetails.tags as tag}
							<TagBadge {tag} />
						{/each}
					{:else}
						<span class="text-sm text-gray-500">No tags</span>
					{/if}
				</div>
			</div>
		</div>

		<div
			class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out {isDetailsVisible
				? 'ml-80'
				: 'ml-0'}"
		>
			<header class="bg-surface-100-800-token p-4">
				<ol class="breadcrumb mb-2">
					<li class="crumb"><a class="anchor" href="/browse">Browse All Scores</a></li>
					<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
					<li class="crumb">{scoreDetails.title}</li>
				</ol>
				<div class="flex justify-between items-center">
					<div>
						<h1 class="h2 mb-1">{scoreDetails.title}</h1>
						<p class="text-lg text-surface-600-300-token">
							By {scoreDetails.composer} • {scoreDetails.dateComposed}
						</p>
					</div>
					{#if !isDetailsVisible}
						<button class="btn variant-ghost-primary" on:click={toggleDetails}>
							<IconMenu />
							<span class="ml-2">Show Details</span>
						</button>
					{/if}
				</div>
			</header>
			<main class="flex-1 overflow-x-hidden overflow-y-auto bg-surface-50-900-token p-4">
				<div class="card p-4 h-full">
					<ScoreViewer meiData={scoreDetails.meiData} />
				</div>
			</main>
		</div>
	</div>
</div>
