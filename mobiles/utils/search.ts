export const normalize = (s: string) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const tokenize = (q: string) => normalize(q).split(/\s+/).filter(Boolean);

const isSubsequence = (text: string, pattern: string) => {
  let i = 0;
  for (let c of text) if (c === pattern[i]) i++;
  return pattern.length > 0 && i >= pattern.length;
};

export const advancedMatchScore = (textRaw: string, queryRaw: string): number => {
  const text = normalize(textRaw);
  const query = normalize(queryRaw);
  if (!query) return 0;
  const tokens = tokenize(queryRaw);

  let score = 0;
  if (text.includes(query)) score += 10; // full phrase match

  let matchedTokens = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (text.includes(t)) {
      matchedTokens++;
      score += 3; // token present
    }
  }
  if (matchedTokens === tokens.length && tokens.length > 0) score += 5; // all tokens

  if (isSubsequence(text, query)) score += 2; // letter-by-letter in-order

  return score;
};

export const fuzzyFilter = <T,>(
  query: string,
  items: T[],
  getText: (item: T) => string
): T[] => {
  const q = (query ?? "").trim();
  if (!q) return items;
  const scored = items
    .map((it) => ({ it, s: advancedMatchScore(getText(it) ?? "", q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.map((x) => x.it);
};

