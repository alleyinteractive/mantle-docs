import React from 'react';
import Features, { FeatureItem } from '../Features';

const FeatureList: FeatureItem[] = [
  {
    title: 'Flexible RESTful Routing',
    link: '/docs/basics/requests',
    description: (
      <>
        Use a Symfony-powered routing framework on top of WordPress to respond to requests in your application. Respond to requests using native PHP or Blade templates, both supporting a set of powerful template helpers to help DRY up your templates.
      </>
    ),
  },
  {
    title: 'Interface with Data Models',
    link: '/docs/models',
    description: (
      <>
        Work with actual models to interact with data in your application. Mantle streamlines WordPress development to provide a uniform interface to work with core WordPress data structures. Define relationships between models and data structures bringing WordPress into the 21st century.
      </>
    ),
  },
  {
    title: 'Test Framework',
    link: '/docs/testing/testing',
    description: (
      <>
        Use the independent Mantle Test Framework to make writing unit tests simpler than ever. Supports a drop-in replacement for WordPress core testing framework that will run faster and allow IDE-friendly assertions. Runs PHPUnit 9.5+ out of the box.
      </>
    ),
  },
];

export default function HomepageLowerFeatures(): JSX.Element {
  return (
    <Features list={FeatureList} />
  );
}
