import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScheduledPost {
  id: number;
  title: string;
  platform: string;
  date: string;
  time: string;
  color: string;
}

export default function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data, isLoading } = useQuery<{ scheduledPosts: ScheduledPost[] }>({
    queryKey: ['/api/content/calendar', format(currentMonth, 'yyyy-MM')],
  });
  
  // Default data in case API hasn't returned data yet
  const scheduledPosts = data?.scheduledPosts || [
    { id: 1, title: "YouTube Tutorial", platform: "YouTube", date: "2023-06-17", time: "10:00 AM", color: "#6200EA" },
    { id: 2, title: "Instagram Carousel", platform: "Instagram", date: "2023-06-21", time: "6:00 PM", color: "#FF9100" },
    { id: 3, title: "Twitter Thread", platform: "Twitter", date: "2023-06-24", time: "12:00 PM", color: "#FF4081" }
  ];
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add days from previous/next month to fill the calendar grid
  const firstDayOfMonth = monthStart.getDay();
  const lastDayOfMonth = monthEnd.getDay();
  
  const prevMonthDays = firstDayOfMonth === 0 ? [] : Array.from({ length: firstDayOfMonth }, (_, i) => 
    new Date(monthStart.getFullYear(), monthStart.getMonth(), -i)
  ).reverse();
  
  const nextMonthDays = lastDayOfMonth === 6 ? [] : Array.from({ length: 6 - lastDayOfMonth }, (_, i) => 
    new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate() + i + 1)
  );
  
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Simplified function to check if a day has a post (in a real app, we'd compare actual dates)
  const getDayPost = (day: Date) => {
    // For the mock data, just create a sample distribution
    const dayOfMonth = day.getDate();
    if (dayOfMonth % 7 === 0) return { color: "#6200EA" };
    if (dayOfMonth % 5 === 0) return { color: "#FF9100" };
    if (dayOfMonth % 3 === 0) return { color: "#FF4081" };
    return null;
  };
  
  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
        <CardTitle className="font-heading font-semibold text-base">Content Calendar</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-4">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h4 className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</h4>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            <motion.div 
              className="grid grid-cols-7 gap-1 text-center text-xs mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-neutral-500 dark:text-neutral-400">Su</div>
              <div className="text-neutral-500 dark:text-neutral-400">Mo</div>
              <div className="text-neutral-500 dark:text-neutral-400">Tu</div>
              <div className="text-neutral-500 dark:text-neutral-400">We</div>
              <div className="text-neutral-500 dark:text-neutral-400">Th</div>
              <div className="text-neutral-500 dark:text-neutral-400">Fr</div>
              <div className="text-neutral-500 dark:text-neutral-400">Sa</div>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-7 gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Previous month days */}
              {prevMonthDays.map((day, i) => (
                <div 
                  key={`prev-${i}`}
                  className="h-10 flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500"
                >
                  {day.getDate()}
                </div>
              ))}
              
              {/* Current month days */}
              {calendarDays.map((day, i) => {
                const hasPost = getDayPost(day);
                return (
                  <div 
                    key={`curr-${i}`}
                    className={cn(
                      "h-10 flex items-center justify-center text-xs relative",
                      isToday(day) && "bg-primary/10 rounded-full font-medium text-primary dark:bg-primary/20"
                    )}
                  >
                    {day.getDate()}
                    {hasPost && (
                      <motion.div 
                        className="absolute bottom-1 w-1 h-1 rounded-full"
                        style={{ backgroundColor: hasPost.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.01, duration: 0.2 }}
                      />
                    )}
                  </div>
                );
              })}
              
              {/* Next month days */}
              {nextMonthDays.map((day, i) => (
                <div 
                  key={`next-${i}`}
                  className="h-10 flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500"
                >
                  {day.getDate()}
                </div>
              ))}
            </motion.div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Upcoming Posts</h4>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              >
                {scheduledPosts.map((post) => (
                  <motion.div 
                    key={post.id}
                    className="p-2 text-xs bg-neutral-50 dark:bg-neutral-700/30 rounded-r-lg"
                    style={{ borderLeftWidth: '2px', borderLeftColor: post.color }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-medium">{post.title}</p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • {post.time}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
