import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Zap, Target, Sparkles, ArrowUpRight } from "lucide-react";
import CompetitorAnalysisPanel from "@/components/competitor-analysis/CompetitorAnalysisPanel";

interface CompetitorData {
  id: number;
  name: string;
  engagementRate: number;
  barHeight: number;
  color: string;
}

interface InsightItem {
  id: number;
  title: string;
  description: string;
  icon: "zap" | "target";
}

interface CompetitorAnalysisData {
  competitors: CompetitorData[];
  insights: InsightItem[];
}

export default function CompetitorAnalysis() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { data, isLoading } = useQuery<CompetitorAnalysisData>({
    queryKey: ['/api/analytics/competitors'],
  });

  // Default data in case the API hasn't returned data yet
  const competitors = data?.competitors || [
    { id: 1, name: "Your Brand", engagementRate: 4.7, barHeight: 44, color: "#6200EA" },
    { id: 2, name: "Competitor A", engagementRate: 3.9, barHeight: 36, color: "#FF9100" },
    { id: 3, name: "Competitor B", engagementRate: 3.1, barHeight: 28, color: "#00BFA5" },
    { id: 4, name: "Competitor C", engagementRate: 5.2, barHeight: 52, color: "#FF4081" }
  ];
  
  const insights = data?.insights || [
    {
      id: 1,
      title: "Content Frequency",
      description: "Competitor C posts 3x more frequently than you on Instagram, which may explain their higher engagement rate.",
      icon: "zap"
    },
    {
      id: 2,
      title: "Content Formats",
      description: "Your video content outperforms competitors, but they lead in carousel posts with 2.1x higher engagement.",
      icon: "target"
    }
  ];

  return (
    <>
      <Card className="col-span-2 shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <CardTitle className="font-heading font-semibold text-base">Competitor Analysis</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Add Competitor
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="text-xs flex items-center gap-1"
                  onClick={() => setIsPanelOpen(true)}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>AI Analysis</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] w-[1200px] h-[85vh] p-0">
                <CompetitorAnalysisPanel />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                <div className="h-40 w-full rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                <div className="h-20 w-full rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Engagement Comparison</h4>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="text-xs px-2 py-1">Weekly</Button>
                    <Button variant="ghost" size="sm" className="text-xs px-2 py-1">Monthly</Button>
                  </div>
                </div>
                
                <div className="w-full h-56 bg-neutral-50 dark:bg-neutral-900 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-end p-4">
                    <div className="flex items-end justify-around w-full h-full">
                      {competitors.map((competitor) => (
                        <motion.div 
                          key={competitor.id}
                          className="flex flex-col items-center w-24"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: competitor.id * 0.1 }}
                        >
                          <motion.div 
                            className="w-12 rounded-t-lg relative overflow-hidden"
                            style={{ backgroundColor: competitor.color, height: 0 }}
                            animate={{ height: `${competitor.barHeight}vh` }}
                            transition={{ duration: 0.8, delay: competitor.id * 0.1 + 0.2, ease: "easeOut" }}
                          >
                            <div className="absolute bottom-0 w-full h-8 opacity-30" style={{ backgroundColor: competitor.color.replace('EA', 'FF') }}></div>
                          </motion.div>
                          <div className="mt-2 text-xs font-medium">{competitor.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{competitor.engagementRate}%</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Content Strategy Insights</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs px-2 py-1 flex items-center gap-1"
                    onClick={() => setIsPanelOpen(true)}
                  >
                    <span>View Advanced</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {insights.map((insight) => (
                    <motion.div 
                      key={insight.id}
                      className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/30"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: insight.id * 0.2 }}
                    >
                      <div className="flex items-center mb-1">
                        <div className={`p-1 rounded-full ${insight.icon === 'zap' ? 'bg-primary/10 text-primary dark:text-primary-light' : 'bg-secondary/10 text-secondary dark:text-secondary-light'} mr-2`}>
                          {insight.icon === 'zap' ? <Zap className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                        </div>
                        <h5 className="text-sm font-medium">{insight.title}</h5>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">{insight.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
