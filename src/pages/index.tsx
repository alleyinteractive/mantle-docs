import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import GitHub from '../assets/github.svg';

// Components.
import HomepageFeatures from '@site/src/components/HomepageFeatures';
// import HomepageLowerFeatures from '@site/src/components/HomepageLowerFeatures';
import HomepageExamples from '../components/HomepageExamples';

import Logo from '../../static/img/logo.svg';
import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <Logo className={styles.heroImage} />
      <p className={clsx('hero__subtitle', styles.heroDescription)}>{useDocusaurusContext().siteConfig.tagline}</p>
      <p className={styles.heroActions}>
        <Link className={clsx('button button--lg button--primary', styles.button)} to="/docs/getting-started">
          Get Started →
        </Link>
        <Link className={clsx('button button--lg button--secondary margin-left--sm', styles.button, styles.buttonLower)} href="https://github.com/alleyinteractive/mantle/">
          GitHub
          <GitHub className={styles.githubIcon} />
        </Link>
      </p>
    </header>
  );
}

function HomepageTestkitCallout() {
  return (
    <div className="container">
      <div className={styles.testkitCallout}>
        <h4>Looking to upgrade your WordPress unit testing?</h4>
        <p>
          Check out
          {' '}
          <Link to="/docs/testing/testkit">Mantle Testkit</Link>
          {' '}
          for a drop-in replacement to WordPress core tests via our
          {' '}
          <Link to="/docs/testing">testing framework</Link>
          {' '}
          that allows you to fluently tests WordPress in a modern way.
        </p>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout description={siteConfig.tagline}>
      <HomepageHeader />
      <HomepageTestkitCallout />
      <main>
        <HomepageFeatures />
        <HomepageExamples />
        {/* Disabled for the time being. */}
        {/* <HomepageLowerFeatures /> */}

        <div className="container">
          <p className={clsx('text--center', styles.goals)}>
            Mantle is a heavily Laravel-inspired framework for improving the WordPress
            developer experience. It aims to make the development process delightful for the
            developer. WordPress can already accomplish great things out of the box. Mantle
            aims to make it easier and simpler to use. Code should be fluent, reusable, easy
            to read, testable, and delightful to work with.
          </p>

          <p className={clsx('text--center', styles.goals)}>
            <Link to="/docs/getting-started">Get started here</Link>
            {' '}
            or visit our
            {' '}
            <Link to="https://github.com/alleyinteractive/mantle">GitHub</Link>
            {' '}
            to contribute.
          </p>
        </div>
      </main>
    </Layout>
  );
}
