export type TokenKind = 'plain' | 'punct' | 'heading' | 'key' | 'tag' | 'code';

export interface Token {
  text: string;
  kind: TokenKind;
}

/**
 * Colours one line of a slides file for the editor panel. It is not a markdown parser: it knows
 * the few shapes the landing deck uses (separators, frontmatter keys, headings, bullets, code
 * fences and slide.ng tags) and leaves everything else plain.
 */
export function highlightLine(line: string, inFence: boolean): Token[] {
  if (/^```/.test(line)) return [{text: line, kind: 'punct'}];
  if (inFence) return [{text: line, kind: 'code'}];
  if (line === '---') return [{text: line, kind: 'punct'}];
  if (/^#{1,6} /.test(line)) return [{text: line, kind: 'heading'}];
  if (/^<\/?v-clicks?>$|^::[\w-]+::$/.test(line)) return [{text: line, kind: 'tag'}];
  const bullet = /^(- )(.*)$/.exec(line);
  if (bullet) {
    return [{text: bullet[1], kind: 'punct'}, ...highlightInline(bullet[2])];
  }
  const key = /^([\w-]+:)(.*)$/.exec(line);
  if (key)
    return [
      {text: key[1], kind: 'key'},
      {text: key[2], kind: 'plain'},
    ];
  return highlightInline(line);
}

/** Inline code (`like this`) and Angular interpolation. */
function highlightInline(text: string): Token[] {
  const tokens: Token[] = [];
  for (const part of text.split(/(`[^`]*`|\{\{[^}]*\}\})/)) {
    if (!part) continue;
    tokens.push({text: part, kind: /^(`|\{\{)/.test(part) ? 'code' : 'plain'});
  }
  return tokens;
}

/** The fence state at the start of each line, so a code line is coloured as code. */
export function fenceStates(lines: readonly string[]): boolean[] {
  let open = false;
  return lines.map((line) => {
    const inside = open && !/^```/.test(line);
    if (/^```/.test(line)) open = !open;
    return inside;
  });
}
