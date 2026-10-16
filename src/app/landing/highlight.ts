/** How a piece of the typed markdown is coloured in the editor. */
export type PartKind = 'plain' | 'rule' | 'key' | 'mark' | 'heading';

export interface Part {
  text: string;
  kind: PartKind;
}

/**
 * The coloured parts of one line of the typed markdown, the way Slidev's demo colours it:
 * a `---` line is dim, a YAML key (`layout:`) is amber, a `#` is amber and the heading text bold.
 * The caret can be anywhere in a half-typed line, so nothing here needs the line to be finished.
 */
export function lineParts(line: string): Part[] {
  if (line === '') return [];
  if (/^-{1,3}$/.test(line)) return [{text: line, kind: 'rule'}];
  const key = /^([A-Za-z][\w-]*:)(.*)$/.exec(line);
  if (key) {
    return [
      {text: key[1], kind: 'key'},
      ...(key[2] ? [{text: key[2], kind: 'plain' as const}] : []),
    ];
  }
  const heading = /^(#{1,6})(\s.*|)$/.exec(line);
  if (heading) {
    return [
      {text: heading[1], kind: 'mark'},
      ...(heading[2] ? [{text: heading[2], kind: 'heading' as const}] : []),
    ];
  }
  return [{text: line, kind: 'plain'}];
}

/** What a line of the editor is made of: coloured text, and the caret. */
export type Segment = Part | {kind: 'caret'; text: ''};

/** The lines of `text` as segments, with the caret in the line it belongs to (`null`: no caret). */
export function editorLines(text: string, caret: number | null): Segment[][] {
  let start = 0;
  return text.split('\n').map((line) => {
    const parts: Segment[] = lineParts(line);
    const end = start + line.length;
    if (caret === null || caret < start || caret > end) {
      start = end + 1;
      return parts;
    }
    // Split the part the caret is in, and put the caret between the halves.
    let rest = caret - start;
    const out: Segment[] = [];
    let placed = false;
    for (const part of parts as Part[]) {
      if (!placed && rest <= part.text.length) {
        out.push({...part, text: part.text.slice(0, rest)}, {kind: 'caret', text: ''});
        if (rest < part.text.length) out.push({...part, text: part.text.slice(rest)});
        placed = true;
      } else {
        out.push(part);
        rest -= part.text.length;
      }
    }
    if (!placed) out.push({kind: 'caret', text: ''});
    start = end + 1;
    return out.filter((seg) => seg.kind === 'caret' || seg.text !== '');
  });
}
