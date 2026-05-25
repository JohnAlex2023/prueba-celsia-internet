import type { ReactNode } from 'react';

interface Props {
  type: 'error' | 'success';
  children: ReactNode;
}

export function Alert({ type, children }: Props) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
