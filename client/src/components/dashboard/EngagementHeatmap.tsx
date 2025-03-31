import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

interface HeatmapData {
  weekdays: string[];
  times: string[];
  cells: {
    value: number; // 0-4 intensity (0 = lowest, 4 = highest)
    time: string;
    day: string;
  }[];
  bestTime: {
    day: string;
    time: string;
  };
}

export default function EngagementHeatmap() {
  const { data, isLoading } = useQuery<HeatmapData>({
    queryKey: ['/api/analytics/heatmap'],
  });
  
  // Default coloring for the heatmap cells
  const getCellColor = (value: number, isDark: boolean) => {
    const colors = [
      isDark ? 'bg-green-900/20' : 'bg-green-100',
      isDark ? 'bg-green-800/30' : 'bg-green-200',
      isDark ? 'bg-yellow-700/40' : 'bg-yellow-300',
      isDark ? 'bg-orange-600/40' : 'bg-orange-400',
      isDark ? 'bg-red-500/60' : 'bg-red-500',
    ];
    return colors[value];
  };
  
  // Generate mock data in lieu of API data
  const mockHeatmapData: HeatmapData = {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    times: ['9AM', '12PM', '3PM', '6PM', '9PM'],
    cells: [],
    bestTime: {
      day: 'Wednesday',
      time: '5PM'
    }
  };
  
  // Generate mock cell data for the heatmap
  if (mockHeatmapData.cells.length === 0) {
    for (let day = 0; day < 7; day++) {
      for (let time = 0; time < 8; time++) {
        // Create some patterns - higher engagement in evenings and midweek
        let value = Math.floor(Math.random() * 5);
        
        // Boost midweek evening values
        if (day >= 2 && day <= 4 && time >= 4 && time <= 5) {
          value = Math.min(4, value + 2);
        }
        
        mockHeatmapData.cells.push({
          day: mockHeatmapData.weekdays[day % mockHeatmapData.weekdays.length],
          time: String(time),
          value
        });
      }
    }
  }
  
  const heatmapData = data || mockHeatmapData;
  
  // Extract days for the column view
  const uniqueDays = Array.from(new Set(heatmapData.cells.map(cell => cell.day)));

  // Determine if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
        <CardTitle className="font-heading font-semibold text-base">Engagement Heatmap</CardTitle>
        <Button variant="ghost" size="icon">
          <Upload className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-3 w-12 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
              {Array.from({ length: 56 }).map((_, i) => (
                <div key={i} className="h-5 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-xs text-neutral-500 dark:text-neutral-400 flex justify-between">
              <span>Monday</span>
              <span>Wednesday</span>
              <span>Friday</span>
              <span>Sunday</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-3">
              {uniqueDays.map((day, dayIndex) => (
                <div key={dayIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 8 }).map((_, timeIndex) => {
                    const cellData = heatmapData.cells.find(
                      cell => cell.day === day && cell.time === String(timeIndex)
                    );
                    
                    return (
                      <motion.div 
                        key={`${day}-${timeIndex}`}
                        className={cn(
                          "h-5 rounded",
                          getCellColor(cellData?.value || 0, isDarkMode)
                        )}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3,
                          delay: dayIndex * 0.05 + timeIndex * 0.01 
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="text-xs text-right text-neutral-500 dark:text-neutral-400">Time (24h)</div>
            
            <div className="mt-3 mb-2 flex items-center justify-between">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Low</div>
              <div className="w-2/3 h-2 rounded bg-gradient-to-r from-[#00E676] via-[#FFEB3B] to-[#FF6D00]"></div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">High</div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Best time to post</div>
                <div className="text-base font-heading font-semibold text-primary dark:text-primary-light">
                  {heatmapData.bestTime.day} {heatmapData.bestTime.time}
                </div>
              </div>
              <Button className="px-3 py-1.5 text-sm font-medium bg-primary text-white hover:bg-primary-dark">
                Schedule
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
