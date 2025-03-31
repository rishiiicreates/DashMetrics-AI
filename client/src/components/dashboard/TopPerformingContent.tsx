import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, ThumbsUp } from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  platform: "youtube" | "instagram" | "twitter";
  platformIcon: React.ReactNode;
  thumbnailUrl: string;
  views: number;
  likes: number;
}

export default function TopPerformingContent() {
  const { data, isLoading } = useQuery<{ items: ContentItem[] }>({
    queryKey: ['/api/content/top-performing'],
  });
  
  // Platform icon components
  const platformIcons = {
    youtube: (
      <div className="p-1 rounded-md bg-red-500/10 text-red-500 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      </div>
    ),
    instagram: (
      <div className="p-1 rounded-md bg-purple-500/10 text-purple-500 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>
    ),
    twitter: (
      <div className="p-1 rounded-md bg-sky-500/10 text-sky-500 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </div>
    )
  };
  
  // Default data in case the API hasn't returned data yet
  const defaultContentItems: ContentItem[] = [
    {
      id: 1,
      title: "10 Productivity Tips for Remote Workers",
      platform: "youtube",
      platformIcon: platformIcons.youtube,
      thumbnailUrl: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      views: 28400,
      likes: 2100
    },
    {
      id: 2,
      title: "My Work From Home Setup (Swipe for Details)",
      platform: "instagram",
      platformIcon: platformIcons.instagram,
      thumbnailUrl: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      views: 12700,
      likes: 943
    },
    {
      id: 3,
      title: "Just launched our team productivity tool after 6 months of development! Check it out [THREAD]",
      platform: "twitter",
      platformIcon: platformIcons.twitter,
      thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      views: 437,
      likes: 1200
    },
    {
      id: 4,
      title: "Office Tour 2023: How We Built Our Creative Space",
      platform: "youtube",
      platformIcon: platformIcons.youtube,
      thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      views: 8900,
      likes: 782
    }
  ];
  
  const contentItems = data?.items || defaultContentItems;
  
  // Format numbers to K/M format
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  return (
    <Card className="row-span-2 shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
        <CardTitle className="font-heading font-semibold text-base">Top Performing Content</CardTitle>
        <Button variant="outline" size="sm" className="text-xs rounded-full">
          All Platforms
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex p-3">
                <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
                <div className="ml-3 flex-1 space-y-2">
                  <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {contentItems.map((item, index) => (
              <motion.div 
                key={item.id}
                className="flex p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={`${item.title} thumbnail`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    {item.platformIcon}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                    </p>
                  </div>
                  <h4 className="font-medium text-sm mt-1">{item.title}</h4>
                  <div className="flex items-center mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center mr-3">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      {formatNumber(item.views)}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {formatNumber(item.likes)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm font-medium text-primary dark:text-primary-light hover:underline">
                View All Content
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
