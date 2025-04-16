import React from 'react';
import TOCInline from '@theme/TOCInline';
import type { Props } from '@theme/TOCInline';

import styles from './styles.module.css';

/**
 * Wrapped two column inline table of contents.
 */
const TOCInlineWrapped = (props: Props) => (
  <div className={styles.tocWrapper}>
    <TOCInline {...props} />
  </div>
);

export default TOCInlineWrapped;