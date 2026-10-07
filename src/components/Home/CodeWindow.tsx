import React, { useState } from 'react';
import clsx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

type File = {
  name: string;
  code: string;
};

type Props = {
  files: File[];
  chrome?: boolean;
  className?: string;
};

export default function CodeWindow({ files, chrome = false, className }: Props): JSX.Element {
  const [active, setActive] = useState(0);

  return (
    <div className={clsx(styles.window, className)}>
      <div className={styles.windowBar} role={files.length > 1 ? 'tablist' : undefined}>
        {chrome && (
          <span className={styles.dots} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
        {files.length > 1 ? (
          files.map((file, index) => (
            <button
              key={file.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={clsx(styles.windowTab, index === active && styles.windowTabActive)}
              onClick={() => setActive(index)}
            >
              {file.name}
            </button>
          ))
        ) : (
          <span className={styles.windowTitle}>{files[0].name}</span>
        )}
      </div>
      <CodeBlock language="php">{files[active].code}</CodeBlock>
    </div>
  );
}
