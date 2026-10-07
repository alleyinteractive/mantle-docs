import React from 'react';
import TOC from '@theme-original/TOC';
import type TOCType from '@theme/TOC';
import type { WrapperProps } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDoc, useDocsVersion } from '@docusaurus/plugin-content-docs/client';

type Props = WrapperProps<typeof TOCType>;

// Matches the prompt the llms-txt "Copy as Markdown" dropdown sends.
const PROMPT = 'Analyze this documentation:';

export default function TOCWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const { version } = useDocsVersion();
  const markdownPath = `${metadata.permalink.replace(/\/$/, '')}.md`;
  const prompt = encodeURIComponent(`${PROMPT} ${new URL(markdownPath, siteConfig.url).toString()}`);
  const fileName = markdownPath.split('/').pop();

  // Markdown copies are only generated for the current docs version.
  if (version !== 'current') {
    return (
      <div className="mantle-toc">
        <TOC {...props} />
      </div>
    );
  }

  return (
    <div className="mantle-toc">
      <TOC {...props} />
      <nav className="mantle-ai-links" aria-label="Use this page with AI">
        <span className="mono-label">Use with AI</span>
        <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noopener noreferrer">
          Open in Claude ↗
        </a>
        <a href={`https://chatgpt.com/?hints=search&prompt=${prompt}`} target="_blank" rel="noopener noreferrer">
          Open in ChatGPT ↗
        </a>
        <a href={markdownPath} data-mono="">
          {fileName}
        </a>
      </nav>
    </div>
  );
}
