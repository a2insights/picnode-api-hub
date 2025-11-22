import { ReactNode } from 'react';

interface ApiReferenceLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export const ApiReferenceLayout = ({ sidebar, children }: ApiReferenceLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <aside className="w-64 border-r bg-card hidden md:block overflow-y-auto">{sidebar}</aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
