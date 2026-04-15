/** Strip `**bold**` markers from procedural FRQ strings (AP booklets use plain type). */
export function stripMarkdownBoldMarkers(input: string): string {
	let s = input;
	while (/\*\*[^*]+\*\*/.test(s)) {
		s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
	}
	return s;
}
