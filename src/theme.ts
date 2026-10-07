import type { PrismTheme } from 'prism-react-renderer';

/**
 * Code blocks stay dark in both color modes, so one theme serves both.
 */
export const codeTheme: PrismTheme = {
  plain: {
    color: '#C5D1DD',
    backgroundColor: '#0B1826',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#6F849B', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#93A6BA' },
    },
    {
      types: ['keyword', 'atrule', 'important', 'selector', 'builtin'],
      style: { color: '#D98BE0' },
    },
    {
      types: ['class-name', 'namespace', 'package', 'maybe-class-name'],
      style: { color: '#8CC2F0' },
    },
    {
      types: ['function', 'function-definition', 'method', 'number', 'boolean', 'constant'],
      style: { color: '#F2A36B' },
    },
    {
      types: ['string', 'char', 'attr-value', 'url', 'inserted'],
      style: { color: '#A8D8A0' },
    },
    {
      types: ['variable', 'parameter', 'property', 'attr-name'],
      style: { color: '#EBD9A6' },
    },
    {
      types: ['tag'],
      style: { color: '#F28B8B' },
    },
    {
      types: ['deleted'],
      style: { color: '#F28B8B' },
    },
    {
      types: ['title'],
      style: { color: '#FFFFFF', fontWeight: 'bold' },
    },
  ],
};
