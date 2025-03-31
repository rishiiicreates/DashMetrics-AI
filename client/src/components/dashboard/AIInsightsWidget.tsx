import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Brain, Clock, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AIInsight {
  title: string;
  summary: string;
  details: string[];
  recommendations: {
    id: number;
    text: string;
    type: "schedule" | "content";
    icon: "time" | "edit";
  }[];
}

export default function AIInsightsWidget() {
  const { data: insightData, isLoading } = useQuery({
    queryKey: ["/api/insights/latest"],
  });

  // Default data in case we don't have any insights yet
  const insight: AIInsight = useMemo(() => 
    insightData || {
      title: "Analysis Summary",
      summary: "Connect your social accounts to get AI-powered insights about your content performance.",
      details: [
        "AI will analyze your engagement patterns",
        "Receive actionable recommendations to improve"
      ],
      recommendations: [
        {
          id: 1,
          text: "Connect your accounts to get started",
          type: "content",
          icon: "edit"
        }
      ]
    }, [insightData]);

  return (
    <Card className="relative overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="ai-doodle before:content-[''] before:absolute before:top-[-5px] before:right-[-5px] before:w-[30px] before:h-[30px] before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22none%22%20stroke%3D%22%23FF4081%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M30%2C30%20Q50%2C10%2070%2C30%20T90%2C50%20T70%2C70%20T30%2C70%20T10%2C50%20T30%2C30%22%2F%3E%3C%2Fsvg%3E')] before:bg-contain before:z-[1] before:transform before:rotate-[15deg]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <CardTitle className="font-heading font-semibold text-base">AI Insights</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
              <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gradient-to-br from-primary/5 to-[#FF4081]/5 rounded-lg border border-primary/10 dark:border-primary/20 mb-4"
              >
                <div className="flex items-start mb-3">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary dark:text-primary-light mr-2">
                    <Brain className="h-5 w-5" />
                  </div>
                  <h4 className="font-heading font-semibold">{insight.title}</h4>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  {insight.summary}
                </p>
                <ul className="text-sm space-y-2">
                  {insight.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-primary dark:text-primary-light mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                <motion.ul 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                >
                  {insight.recommendations.map((recommendation) => (
                    <motion.li 
                      key={recommendation.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <div className={cn(
                        "p-1 rounded-full mr-2",
                        recommendation.type === "schedule" ? "bg-[#00B0FF]/10 text-[#00B0FF]" : "bg-[#76FF03]/10 text-[#76FF03]"
                      )}>
                        {recommendation.icon === "time" ? <Clock className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </div>
                      {recommendation.text}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
