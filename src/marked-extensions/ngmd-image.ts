import type {Tokens} from 'marked';
import {escapeHtml} from './escape-html.ts';

interface NgmdImageToken extends Tokens.Generic {
  type: 'ngmd-image';
  src: string;
  alt: string;
  caption?: string;
  width?: string;
  ratio?: string;
}

// Accepts both self-closing `<ngmd-image .../>` and paired
// `<ngmd-image ...></ngmd-image>` (HTML5 parsers don't honour the
// self-closing form for custom elements, so authoring docs use the
// paired form). `s` flag lets attributes span multiple lines.
const tagRule = /^<ngmd-image([^>]*?)(?:\/>|>\s*<\/ngmd-image>)/s;
const attrRule = (name: string) => new RegExp(`${name}="([^"]*)"`);

export const ngmdImageExtension = {
  name: 'ngmd-image',
  level: 'block' as const,
  start(src: string) {
    return src.match(/^\s*<ngmd-image/m)?.index;
  },
  tokenizer(src: string): NgmdImageToken | undefined {
    const match = tagRule.exec(src);
    if (!match) return undefined;
    const attrs = match[1].trim();
    const srcMatch = attrRule('src').exec(attrs);
    if (!srcMatch) return undefined;
    return {
      type: 'ngmd-image',
      raw: match[0],
      src: srcMatch[1],
      alt: attrRule('alt').exec(attrs)?.[1] ?? '',
      caption: attrRule('caption').exec(attrs)?.[1],
      width: attrRule('width').exec(attrs)?.[1],
      ratio: attrRule('ratio').exec(attrs)?.[1],
    };
  },
  renderer(token: NgmdImageToken) {
    const width = token.width?.trim() ?? '';
    const maxWidth = /^\d+(\.\d+)?$/.test(width) ? `${width}px` : width;
    const figureStyle = maxWidth ? ` style="max-width:${escapeHtml(maxWidth)}"` : '';
    const ratio = escapeHtml(token.ratio ?? '16 / 9');
    const caption = token.caption ? `<figcaption>${escapeHtml(token.caption)}</figcaption>` : '';
    return `<figure class="ngmd-image"${figureStyle}><img src="${escapeHtml(token.src)}" alt="${escapeHtml(token.alt)}" loading="lazy" decoding="async" style="aspect-ratio:${ratio}">${caption}</figure>`;
  },
};
