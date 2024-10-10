const colorCache = new Map();

export function getTagColor(tag: string): string {
	if (colorCache.has(tag)) {
		return colorCache.get(tag);
	}

	let hash = 0;
	for (let i = 0; i < tag.length; i++) {
		hash = tag.charCodeAt(i) + ((hash << 5) - hash);
	}

	const hue = hash % 360;
	const saturation = 25 + (hash % 20); // Lower saturation for more muted colors
	const lightness = 85 + (hash % 10); // Higher lightness for softer colors
	const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

	colorCache.set(tag, color);
	return color;
}

export function getContrastColor(bgColor: string): string {
	// Convert HSL to RGB
	const hslMatch = bgColor.match(/\d+/g);
	const hsl = hslMatch ? hslMatch.map(Number) : [0, 0, 0];
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	let r, g, b;
	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	// Calculate luminance
	const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

	// Return dark gray or light gray based on luminance
	return luminance > 0.6 ? '#4A4A4A' : '#E0E0E0';
}
