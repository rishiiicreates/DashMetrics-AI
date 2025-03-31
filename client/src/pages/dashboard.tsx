import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, LineChart, Users, BarChart3, CalendarDays, Sparkles, AlertTriangle } from "lucide-react";
import NomadicLayout from "@/components/NomadicLayout";
import StatCard from "@/components/dashboard/StatCard";
import PerformanceGraph from "@/components/dashboard/PerformanceGraph";
import AIInsightsWidget from "@/components/dashboard/AIInsightsWidget";
import EngagementHeatmap from "@/components/dashboard/EngagementHeatmap";
import TopPerformingContent from "@/components/dashboard/TopPerformingContent";
import AudienceOverview from "@/components/dashboard/AudienceOverview";
import CompetitorAnalysis from "@/components/dashboard/CompetitorAnalysis";
import ContentCalendar from "@/components/dashboard/ContentCalendar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";

// Nomadic themed stat card component
const NomadicStatCard = ({ title, value, change, icon, iconBg }: { 
  title: string; 
  value: string; 
  change: { value: string; positive: boolean }; 
  icon: React.ReactNode;
  iconBg: string;
}) => {
  return (
    <div className="nomadic-card p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-nomadic-darkblue">{title}</h3>
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-nomadic-darkblue">{value}</span>
        <div className="flex items-center mt-1">
          <span className={`text-xs ${change.positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {change.positive ? '↑' : '↓'} {change.value}
          </span>
          <span className="text-xs text-nomadic-darkblue/60 ml-1">vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { layout, saveLayout } = useDashboard();
  const [, navigate] = useLocation();
  
  // Query all social accounts data
  const { data: socialAccountsData, isLoading: socialAccountsLoading } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: !!user
  });

  // Query content data
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/content/recent'],
    enabled: !!user
  });
  
  // Query analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics/summary'],
    enabled: !!user
  });
  
  // Check authentication status
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);
  
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 rounded-full border-4 border-r-transparent border-nomadic-blue animate-spin mb-4"></div>
          <p className="text-nomadic-darkblue">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // If user isn't authenticated and we're not loading, don't render anything
  // We'll be redirected to login by the useEffect above
  if (!user && !authLoading) {
    return null;
  }
  
  const isDataLoading = socialAccountsLoading || contentLoading || analyticsLoading;
  
  return (
    <NomadicLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-nomadic-darkblue">Analytics Dashboard</h1>
            <p className="text-nomadic-darkblue/70 mt-1">
              Welcome back, {user?.displayName || "Explorer"}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className="crystal-button text-sm flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Last 30 Days
            </button>
            <button className="nomadic-button text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
        
        <div className="crystal-separator my-4"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NomadicStatCard 
          title="Total Followers"
          value={isDataLoading ? "Loading..." : analyticsData?.totalFollowers || "0"}
          change={{ value: isDataLoading ? "-" : analyticsData?.followerGrowth || "0%", positive: true }}
          icon={<Users className="h-5 w-5 text-white" />}
          iconBg="bg-nomadic-blue"
        />
        
        <NomadicStatCard 
          title="Engagement Rate"
          value={isDataLoading ? "Loading..." : analyticsData?.engagementRate || "0%"}
          change={{ value: isDataLoading ? "-" : analyticsData?.engagementChange || "0%", positive: true }}
          icon={<BarChart3 className="h-5 w-5 text-white" />}
          iconBg="bg-nomadic-purple"
        />
        
        <NomadicStatCard 
          title="Total Views"
          value={isDataLoading ? "Loading..." : analyticsData?.totalViews || "0"}
          change={{ value: isDataLoading ? "-" : analyticsData?.viewsChange || "0%", positive: true }}
          icon={<LineChart className="h-5 w-5 text-white" />}
          iconBg="bg-nomadic-leaf"
        />
        
        <NomadicStatCard 
          title="Active Accounts"
          value={isDataLoading ? "Loading..." : (socialAccountsData?.length || "0")}
          change={{ value: "Connected", positive: true }}
          icon={<Users className="h-5 w-5 text-white" />}
          iconBg="bg-nomadic-crystal"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="crystal-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-nomadic-darkblue">Performance Overview</h2>
              <div className="flex space-x-2">
                <button className="text-xs px-3 py-1 rounded-full bg-nomadic-blue/10 text-nomadic-blue">Daily</button>
                <button className="text-xs px-3 py-1 rounded-full bg-nomadic-blue/10 text-nomadic-blue font-medium">Weekly</button>
                <button className="text-xs px-3 py-1 rounded-full bg-nomadic-blue/10 text-nomadic-blue">Monthly</button>
              </div>
            </div>
            <PerformanceGraph />
          </div>
          
          <div className="crystal-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-nomadic-darkblue">Recent Content Performance</h2>
              <button className="text-sm text-nomadic-blue">View All</button>
            </div>
            <TopPerformingContent />
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="nomadic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-nomadic-darkblue">AI Insights</h2>
              <Sparkles className="h-5 w-5 text-nomadic-blue" />
            </div>
            <AIInsightsWidget />
          </div>
          
          <div className="nomadic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-nomadic-darkblue">Engagement Patterns</h2>
              <button className="text-sm text-nomadic-blue">Details</button>
            </div>
            <EngagementHeatmap />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="nomadic-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-nomadic-darkblue">Audience Overview</h2>
            <button className="text-sm text-nomadic-blue">View Demographic</button>
          </div>
          <AudienceOverview />
        </div>
        
        <div className="nomadic-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-nomadic-darkblue">Competitor Analysis</h2>
            <button className="text-sm text-nomadic-blue">View All</button>
          </div>
          <CompetitorAnalysis />
        </div>
      </div>

      <div className="mt-6">
        <div className="nomadic-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-nomadic-darkblue">Content Calendar</h2>
            <button className="text-sm crystal-button px-3 py-1">+ Schedule Post</button>
          </div>
          <ContentCalendar />
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className="mt-6">
        <div className="crystal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-nomadic-darkblue">Connected Social Accounts</h2>
            <button className="text-sm crystal-button px-3 py-1">+ Connect New</button>
          </div>
          
          {isDataLoading ? (
            <div className="text-center py-6">
              <div className="inline-block h-6 w-6 rounded-full border-4 border-r-transparent border-nomadic-blue animate-spin mb-2"></div>
              <p className="text-nomadic-darkblue/70">Loading connected accounts...</p>
            </div>
          ) : socialAccountsData && socialAccountsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialAccountsData.map((account: any) => (
                <div key={account.id} className="crystal-border p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-nomadic-crystal/30 flex items-center justify-center">
                      {/* Platform icon based on account.platform */}
                      <span className="text-nomadic-blue font-bold">{account.platform.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-nomadic-darkblue">{account.handle}</h3>
                      <p className="text-xs text-nomadic-darkblue/70">{account.platform}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-nomadic-darkblue/70">
                    <div className="flex justify-between mb-1">
                      <span>Followers:</span>
                      <span className="font-medium text-nomadic-darkblue">{account.followers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium text-nomadic-darkblue">
                        {new Date(account.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 crystal-border rounded-lg">
              <AlertTriangle className="h-10 w-10 text-nomadic-purple/70 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-nomadic-darkblue mb-1">No Accounts Connected</h3>
              <p className="text-sm text-nomadic-darkblue/70 mb-4">Connect your social media accounts to see analytics</p>
              <button className="nomadic-button text-sm px-4 py-2">Connect Social Accounts</button>
            </div>
          )}
        </div>
      </div>

      {/* Add Widget Button */}
      <div className="fixed bottom-4 right-20 z-10">
        <button className="nature-icon h-12 w-12 hover:bg-nomadic-blue/20 transition-colors shadow-lg">
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </NomadicLayout>
  );
}
