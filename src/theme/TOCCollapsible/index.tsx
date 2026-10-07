import React, { useEffect, useState } from 'react';
import TOCCollapsible from '@theme-original/TOCCollapsible';
import type TOCCollapsibleType from '@theme/TOCCollapsible';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof TOCCollapsibleType>;

function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

export default function TOCCollapsibleWrapper(props: Props): JSX.Element {
  const progress = useReadingProgress();

  return (
    <div className="mantle-toc-mobile">
      <TOCCollapsible {...props} />
      <div className="mantle-toc-mobile__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}
