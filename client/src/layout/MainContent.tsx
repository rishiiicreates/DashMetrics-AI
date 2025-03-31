import { useSidebar } from "@/hooks/useSidebar";
import { Menu } from "lucide-react";

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent = ({ children }: MainContentProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col flex-1 w-0 overflow-hidden">
      {/* Mobile Header */}
      <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow md:hidden">
        <button 
          type="button" 
          className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center flex-1 px-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-800">YourSaaS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto focus:outline-none">
        {children}
      </main>
    </div>
  );
};

export default MainContent;
