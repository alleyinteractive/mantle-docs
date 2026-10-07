import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type CardGridProps = {
  columns?: number;
  children: ReactNode;
};

type CardProps = {
  title: string;
  index?: string;
  href?: string;
  children?: ReactNode;
};

export function CardGrid({ columns = 4, children }: CardGridProps): JSX.Element {
  return (
    <div className={styles.grid} style={{ '--card-min': columns > 3 ? '170px' : '210px' } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function Card({ title, index, href, children }: CardProps): JSX.Element {
  const body = (
    <>
      {index && <span className={styles.index}>{index}</span>}
      <span className={styles.title}>{title}</span>
      {children && <span className={styles.description}>{children}</span>}
    </>
  );

  return href ? (
    <Link className={styles.card} to={href}>
      {body}
    </Link>
  ) : (
    <div className={styles.card}>{body}</div>
  );
}
