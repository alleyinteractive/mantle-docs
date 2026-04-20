import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const markdownUrl = new URL(
    `${metadata.permalink.replace(/\/$/, '')}.md`,
    siteConfig.url,
  ).toString();

  return (
    <>
      <Head>
        <link rel="alternate" type="text/markdown" href={markdownUrl} />
      </Head>
      <Layout {...props} />
    </>
  );
}
