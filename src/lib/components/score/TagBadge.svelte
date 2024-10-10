<script lang="ts">
	import { getTagColor, getContrastColor } from '$lib/utils/colorUtils';

	export let tag: string;

	$: bgColor = getTagColor(tag);
	$: textColor = getContrastColor(bgColor);
</script>

<span class="badge text-xs" style="background-color: {bgColor}; color: {textColor};">
	{tag}
</span>
