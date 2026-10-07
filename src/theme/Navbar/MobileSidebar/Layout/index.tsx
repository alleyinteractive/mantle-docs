import React from 'react';
import Layout from '@theme-original/Navbar/MobileSidebar/Layout';
import type LayoutType from '@theme/Navbar/MobileSidebar/Layout';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof LayoutType>;

function DrawerLinks(): JSX.Element {
  return (
    <div className="mantle-drawer-links">
      <a href="https://github.com/alleyinteractive/mantle" target="_blank" rel="noopener noreferrer">
        GitHub ↗
      </a>
      <a href="/llms.txt" data-mono="">
        llms.txt
      </a>
    </div>
  );
}

export default function LayoutWrapper({ primaryMenu, secondaryMenu, ...props }: Props): JSX.Element {
  return (
    <Layout
      {...props}
      primaryMenu={
        <>
          {primaryMenu}
          <DrawerLinks />
        </>
      }
      secondaryMenu={
        <>
          {secondaryMenu}
          <DrawerLinks />
        </>
      }
    />
  );
}
