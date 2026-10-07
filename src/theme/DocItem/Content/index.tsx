import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import {
  useDoc,
  useDocsVersion,
  useSidebarBreadcrumbs,
} from '@docusaurus/plugin-content-docs/client';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  const { frontMatter } = useDoc();
  const version = useDocsVersion();
  const breadcrumbs = useSidebarBreadcrumbs();
  const section = breadcrumbs?.[0]?.label;
  const eyebrow = [section, `v${version.label}`].filter(Boolean).join(' · ');
  const numbered = (frontMatter as { numbered_headings?: boolean }).numbered_headings === true;

  return (
    <>
      <span className="mantle-eyebrow">{eyebrow}</span>
      <div className={numbered ? 'mantle-numbered' : undefined}>
        <Content {...props} />
      </div>
    </>
  );
}
