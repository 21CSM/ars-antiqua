<script lang="ts">
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import type { Score } from '$lib/types';
	import ScoreSearch from '$lib/components/score/ScoreSearch.svelte';
	import TagFilter from '$lib/components/score/TagFilter.svelte';
	import ScoreCard from '$lib/components/score/ScoreCard.svelte';

	// Mock data for demonstration
	const allScores: Score[] = [
		{
			id: '1',
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
		}
	];

	let searchTerm = writable('');
	let selectedTag = writable('All');

	$: filteredScores = allScores.filter(
		(score) =>
			score.title.toLowerCase().includes($searchTerm.toLowerCase()) &&
			($selectedTag === 'All' || (score.tags && score.tags.includes($selectedTag)))
	);

	$: allTags = ['All', ...new Set(allScores.flatMap((score) => score.tags || []))];

	function openScoreDetails(scoreId: string) {
		goto(`/score/${scoreId}`);
	}
</script>

<div class="container mx-auto p-4">
	<h2 class="h2 mb-6">Browse All Scores</h2>

	<div class="mb-6 flex gap-2">
		<ScoreSearch bind:value={$searchTerm} />
		<TagFilter tags={allTags} bind:selectedTag={$selectedTag} />
	</div>

	{#if filteredScores.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredScores as score (score.id)}
				<ScoreCard {score} onClick={openScoreDetails} />
			{/each}
		</div>
	{:else}
		<div class="text-center py-8">
			<p>No scores found matching your search criteria.</p>
		</div>
	{/if}
</div>
