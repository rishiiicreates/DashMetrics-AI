import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowDownRight, Users, ThumbsUp, Eye, Library } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  type: "followers" | "engagement" | "views" | "content";
  endpoint: string;
}

interface StatData {
  value: string;
  change: number;
  period: string;
}

export default function StatCard({ title, type, endpoint }: StatCardProps) {
  const { data, isLoading } = useQuery<StatData>({
    queryKey: [endpoint],
  });
  
  const getIcon = () => {
    switch (type) {
      case "followers":
        return (
          <Users className="h-6 w-6" />
        );
      case "engagement":
        return (
          <ThumbsUp className="h-6 w-6" />
        );
      case "views":
        return (
          <Eye className="h-6 w-6" />
        );
      case "content":
        return (
          <Library className="h-6 w-6" />
        );
    }
  };
  
  const getIconBgColor = () => {
    switch (type) {
      case "followers":
        return "bg-primary/10 text-primary dark:text-primary-light";
      case "engagement":
        return "bg-secondary/10 text-secondary dark:text-secondary-light";
      case "views":
        return "bg-accent/10 text-accent dark:text-accent-light";
      case "content":
        return "bg-[#FF4081]/10 text-[#FF4081]";
    }
  };
  
  // Default data if API hasn't returned anything yet
  const statData: StatData = data || {
    value: type === "followers" ? "158.4K" : 
           type === "engagement" ? "4.7%" : 
           type === "views" ? "2.3M" : "78",
    change: type === "engagement" ? -0.8 : type === "content" ? 4 : 8.2,
    period: type === "content" ? "new this month" : "vs last month"
  };
  
  return (
    <Card className="widget shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-2"></div>
            ) : (
              <motion.p 
                className="text-2xl font-heading font-bold mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {statData.value}
              </motion.p>
            )}
            {isLoading ? (
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mt-1"></div>
            ) : (
              <div className="flex items-center mt-1">
                <span className={`text-${statData.change >= 0 ? 'green' : 'red'}-500 text-sm flex items-center`}>
                  {statData.change >= 0 ? 
                    <ArrowUpRight className="h-4 w-4 mr-0.5" /> : 
                    <ArrowDownRight className="h-4 w-4 mr-0.5" />
                  }
                  {Math.abs(statData.change)}
                  {type === "content" ? "" : "%"}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">{statData.period}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${getIconBgColor()}`}>
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
