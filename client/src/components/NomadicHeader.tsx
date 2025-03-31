import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import NomadicLogo from './NomadicLogo';
import {
  Bell,
  Search,
  Menu,
  Settings,
  User,
  LogOut,
  MessageSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NomadicHeader: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="w-full py-3 px-4 md:px-6 backdrop-blur-sm bg-white/70 border-b border-nomadic-crystal/20 flex items-center justify-between">
      <div className="flex items-center">
        <NomadicLogo />
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-3">
        {/* Search button */}
        <div className="nature-icon">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-nomadic-darkblue" />
        </div>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="nature-icon relative">
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-nomadic-darkblue" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-nomadic-purple rounded-full"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 crystal-card">
            <DropdownMenuLabel className="organic-text flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs px-2 py-0.5 bg-nomadic-blue/10 text-nomadic-blue rounded-full">3 new</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="crystal-separator !my-1" />
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 hover:bg-nomadic-crystal/10 transition-colors rounded-md cursor-pointer">
                <div className="text-sm font-medium text-nomadic-darkblue">New competitor insights ready</div>
                <div className="text-xs text-nomadic-darkblue/70 mt-1">AI has analyzed your competitors and found 3 new opportunities</div>
                <div className="text-xs text-nomadic-blue mt-2">Just now</div>
              </div>
              <div className="p-3 hover:bg-nomadic-crystal/10 transition-colors rounded-md cursor-pointer">
                <div className="text-sm font-medium text-nomadic-darkblue">Content performance updated</div>
                <div className="text-xs text-nomadic-darkblue/70 mt-1">Your latest post has reached 2.5K engagement</div>
                <div className="text-xs text-nomadic-blue mt-2">2 hours ago</div>
              </div>
              <div className="p-3 hover:bg-nomadic-crystal/10 transition-colors rounded-md cursor-pointer">
                <div className="text-sm font-medium text-nomadic-darkblue">Weekly report available</div>
                <div className="text-xs text-nomadic-darkblue/70 mt-1">Your analytics summary for last week is ready to view</div>
                <div className="text-xs text-nomadic-blue mt-2">Yesterday</div>
              </div>
            </div>
            <DropdownMenuSeparator className="crystal-separator !my-1" />
            <DropdownMenuItem className="crystal-button m-2 flex justify-center !cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Messages */}
        <button className="nature-icon">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-nomadic-darkblue" />
        </button>
        
        {/* Settings */}
        <button className="nature-icon">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-nomadic-darkblue" />
        </button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 ml-1 rounded-full bg-nomadic-blue/20 text-nomadic-blue flex items-center justify-center border border-nomadic-crystal/30 hover:bg-nomadic-blue/30 transition-colors">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="crystal-card">
            <DropdownMenuLabel className="flex flex-col items-center py-4">
              <div className="h-14 w-14 rounded-full bg-nomadic-blue/20 text-nomadic-blue flex items-center justify-center border border-nomadic-crystal/30 mb-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <span className="text-sm font-medium">{user?.displayName || user?.email || "User"}</span>
              <span className="text-xs text-muted-foreground">Analytics Explorer</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="crystal-separator !my-1" />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem>Subscription Plan</DropdownMenuItem>
            <DropdownMenuSeparator className="crystal-separator !my-1" />
            <DropdownMenuItem 
              className="text-red-500 focus:text-red-500" 
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NomadicHeader;