import React from 'react'
import Header from '~/components/layout/Header';
import Sidebar from '~/components/layout/Sidebar';
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="flex h-dvh w-full flex-col text-xs">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col p-4 pb-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;