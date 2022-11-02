import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageLowerFeatures from '@site/src/components/HomepageLowerFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <img src="/img/logo.svg" className={styles.heroImage} alt="Mantle" />
      <p className={clsx('hero__subtitle', styles.heroDescription)}>Mantle is a framework for building large, robust websites and applications with WordPress</p>
      <p className={styles.heroActions}>
        <Link className="button button--lg button--primary" to="/docs/getting-started/installation">
          Get Started →
        </Link>
        <Link className="button button--lg button--secondary margin-left--sm" href="https://github.com/alleyinteractive/mantle/">
          GitHub
        </Link>
      </p>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        {/* <HomepageExamples />
        <HomepageLowerFeatures /> */}
        <HomepageLowerFeatures />

        <div className="container">
          <p className={clsx('text--center', styles.goals)}>
            Mantle is a heavily Laravel-inspired framework for improving the WordPress
            developer experience. It aims to make the development process delightful for the
            developer. WordPress can already accomplish great things out of the box. Mantle
            aims to make it easier and simpler to use. Code should be fluent, reusable, easy
            to read, testable, and delightful to work with.
          </p>

          <p className={clsx('text--center', styles.goals)}>
            <Link to="/docs/getting-started/installation/">Get started here</Link>
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
