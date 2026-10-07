import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type Props = {
  command: string;
  className?: string;
};

export default function CopyCommand({ command, className }: Props): JSX.Element {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={clsx(styles.command, className)}>
      <span className={styles.prompt} aria-hidden="true">$</span>
      <code className={styles.commandText}>{command}</code>
      <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? 'Copied' : `Copy “${command}”`}>
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
        )}
      </button>
    </div>
  );
}
