import React from 'react';

export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-stone-200/60 dark:bg-stone-700/50 ${className}`}
      {...props}
    />
  );
}
