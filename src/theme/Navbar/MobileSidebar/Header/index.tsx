import React from 'react';
import Header from '@theme-original/Navbar/MobileSidebar/Header';
import type HeaderType from '@theme/Navbar/MobileSidebar/Header';
import type { WrapperProps } from '@docusaurus/types';
import SearchBar from '@theme/SearchBar';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

type Props = WrapperProps<typeof HeaderType>;

export default function HeaderWrapper(props: Props): JSX.Element {
  return (
    <>
      <Header {...props} />
      <div className="mantle-drawer-tools">
        <SearchBar />
        <DocsVersionDropdownNavbarItem items={[]} dropdownItemsBefore={[]} dropdownItemsAfter={[]} />
      </div>
    </>
  );
}
