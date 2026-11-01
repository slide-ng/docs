import {Component, computed, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {apiIndex} from 'virtual:ngmd/api-index';
import {symbolUrl} from '../../../types/api';

type JsDocPart =
  {kind: 'text' | 'code'; text: string} | {kind: 'url' | 'symbol'; text: string; href: string};

/**
 * Renders a symbol's JSDoc body. Plain prose for now; once `marked` is
 * exposed on the runtime side via a shared helper, this component will
 * render the description through the same pipeline as `.md` content (code
 * fences highlighted, inline links resolved, keyword auto-linking applied).
 *
 * Today: paragraphs split on blank lines, `<code>` for backtick-wrapped
 * tokens, links for bare URLs and `{@link Symbol}` tags. Enough for the v1 cut.
 */
@Component({
  selector: 'app-api-jsdoc',
  imports: [RouterLink],
  templateUrl: './api-jsdoc.html',
})
export class ApiJsDoc {
  readonly text = input<string>('');

  readonly paragraphs = computed(() => {
    const body = this.text().trim();
    if (!body) return [];
    return body.split(/\n\s*\n/).map((p) => parseParagraph(p.replace(/\s*\n\s*/g, ' ')));
  });
}

const TOKEN =
  /\{@link(?:code|plain)?\s+([^\s|}]+)(?:\s*\|\s*|\s+)?([^}]*)\}|`([^`]+)`|(https?:\/\/[^\s<]*[^\s<.,;:!?)'"])/g;

function parseParagraph(input: string): JsDocPart[] {
  const parts: JsDocPart[] = [];
  let last = 0;
  for (const m of input.matchAll(TOKEN)) {
    if (m.index > last) parts.push({kind: 'text', text: input.slice(last, m.index)});
    last = m.index + m[0].length;
    const [, target, label, code, url] = m;
    if (code) parts.push({kind: 'code', text: code});
    else if (url) parts.push({kind: 'url', text: url, href: url});
    else parts.push(linkPart(target, label.trim()));
  }
  if (last < input.length) parts.push({kind: 'text', text: input.slice(last)});
  return parts;
}

function linkPart(target: string, label: string): JsDocPart {
  const text = label || target;
  if (/^https?:\/\//.test(target)) return {kind: 'url', text, href: target};
  const sym = apiIndex.find((s) => s.name === target.split('.')[0]);
  return sym ? {kind: 'symbol', text, href: symbolUrl(sym)} : {kind: 'code', text};
}
