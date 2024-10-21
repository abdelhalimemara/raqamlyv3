import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white ml-64">
        <div className="w-full px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;