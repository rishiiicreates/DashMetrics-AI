import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PerformanceData {
  date: string;
  youtube: number;
  instagram: number;
  twitter: number;
}

export default function PerformanceGraph() {
  const [timeframe, setTimeframe] = useState<"30days" | "quarter" | "ytd">("30days");
  
  const { data, isLoading } = useQuery<{ data: PerformanceData[] }>({
    queryKey: ['/api/analytics/performance', timeframe],
  });
  
  // Default data in case API hasn't returned data yet
  const defaultData: PerformanceData[] = [
    { date: "Jan 1", youtube: 4000, instagram: 2400, twitter: 1800 },
    { date: "Jan 15", youtube: 3000, instagram: 1398, twitter: 2800 },
    { date: "Feb 1", youtube: 2000, instagram: 9800, twitter: 2200 },
    { date: "Feb 15", youtube: 2780, instagram: 3908, twitter: 2000 },
    { date: "Mar 1", youtube: 1890, instagram: 4800, twitter: 2181 },
    { date: "Mar 15", youtube: 2390, instagram: 3800, twitter: 2500 },
    { date: "Apr 1", youtube: 3490, instagram: 4300, twitter: 2100 },
  ];
  
  const performanceData = data?.data || defaultData;
  
  return (
    <Card className="col-span-2 shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
        <CardTitle className="font-heading font-semibold text-base">Performance Overview</CardTitle>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              timeframe === "30days" 
                ? "bg-primary/10 text-primary dark:text-primary-light" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            )}
            onClick={() => setTimeframe("30days")}
          >
            Last 30 Days
          </Button>
          <Button 
            size="sm" 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              timeframe === "quarter" 
                ? "bg-primary/10 text-primary dark:text-primary-light" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            )}
            onClick={() => setTimeframe("quarter")}
          >
            Last Quarter
          </Button>
          <Button 
            size="sm" 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              timeframe === "ytd" 
                ? "bg-primary/10 text-primary dark:text-primary-light" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            )}
            onClick={() => setTimeframe("ytd")}
          >
            Year to Date
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={timeframe}
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis dataKey="date" stroke="#9E9E9E" fontSize={12} />
                    <YAxis stroke="#9E9E9E" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="youtube"
                      stroke="#6200EA"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="instagram"
                      stroke="#00BFA5"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1000}
                      animationBegin={300}
                    />
                    <Line
                      type="monotone"
                      dataKey="twitter"
                      stroke="#1DA1F2"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1000}
                      animationBegin={600}
                    />
                    <Legend align="right" verticalAlign="bottom" iconType="circle" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
