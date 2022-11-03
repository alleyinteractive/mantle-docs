import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

export type FeatureItem = {
  description: JSX.Element;
  link?: string;
  title: string;
};

function Feature({link = null, title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--left">
      </div>
      <div className="text--left padding-horiz--md">
        {link ? (
          <h3 className={styles.featureTitle}>
            <Link to={link}>{title}</Link>
          </h3>
        ) : (
          <h3 className={styles.featureTitle}>{title}</h3>
        )}
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function Features({ list }: { list: FeatureItem[] }): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {list.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
