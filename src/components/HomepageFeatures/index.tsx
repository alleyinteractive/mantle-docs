import React from 'react';
import Link from '@docusaurus/Link';
import Features, { FeatureItem } from '../Features';

const FeatureList: FeatureItem[] = [
  {
    title: 'Simplicity First',
    description: (
      <>
        Mantle believes that enterprise-level WordPress development is possible and should have a simple and delightful syntax.
      </>
    ),
  },
  {
    title: 'Inspired by Laravel',
    description: (
      <>
        Enjoy the flexibility of the Laravel Framework inside of WordPress with a baked-in WordPress integration. Underneath the hood, Mantle uses WordPress core functions and APIs.
      </>
    ),
  },
  {
    title: 'Modern Toolkit',
    description: (
      <>
        Includes a
        {' '}
        <Link to="/docs/models">powerful ORM</Link>
        , simple to use
        {' '}
        <Link to="/docs/basics/requests">routing</Link>
        ,
        {' '}
        <Link to="/docs/basics/templating">blade-powered templating</Link>
        , and a
        {' '}
        <Link to="/docs/testing">fast independent testing library for WordPress</Link>
        {' '}
        out of the box.
      </>
    ),
  },
];

export default function HomepageFeatures(): JSX.Element {
  return (
    <Features list={FeatureList} />
  );
}
