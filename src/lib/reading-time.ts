// Average adult silent-reading speed for this kind of prose.
const WORDS_PER_MINUTE = 225;

export function estimateReadingMinutes(markdown: string) {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
