'use client';

import { useEffect, useRef } from 'react';

export default function VisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    fetch('/api/visitors', { method: 'POST' }).catch(() => {});
  }, []);

  return null;
}
