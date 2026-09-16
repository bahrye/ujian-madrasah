<script lang="ts">
	import ExamAnalyticsView from '$lib/components/analytics/ExamAnalyticsView.svelte';

	export let data;
</script>

<svelte:head>
	<title>Laporan & Analisis Ujian — Guru</title>
</svelte:head>

<ExamAnalyticsView
	analytics={data.analytics}
	exams={data.exams}
	selectedExamId={data.selectedExamId}
	role="guru"
/>
