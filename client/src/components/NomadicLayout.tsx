import React, { useState } from 'react';
import NomadicHeader from './NomadicHeader';
import NomadicSidebar from './NomadicSidebar';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NomadicLayoutProps {
  children: React.ReactNode;
}

const NomadicLayout: React.FC<NomadicLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NomadicHeader />
      
      <div className="flex-1 flex">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-4 right-4 z-50 w-12 h-12 crystal-card rounded-full flex items-center justify-center shadow-lg border border-nomadic-crystal/30"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-nomadic-blue" />
            ) : (
              <Menu className="h-6 w-6 text-nomadic-blue" />
            )}
          </button>
        )}
        
        {/* Sidebar */}
        <div 
          className={`
            ${isMobile ? 'fixed inset-y-0 left-0 z-40 transition-transform transform duration-300 ease-in-out' : 'relative'}
            ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <NomadicSidebar />
          
          {/* Backdrop for mobile */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NomadicLayout;