import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface AgeGroup {
  range: string;
  percentage: number;
}

interface GeoData {
  country: string;
  percentage: number;
}

interface AudienceData {
  ageGroups: AgeGroup[];
  geoDistribution: GeoData[];
}

export default function AudienceOverview() {
  const { data, isLoading } = useQuery<AudienceData>({
    queryKey: ['/api/analytics/audience'],
  });

  // Default data in case we don't have any audience data yet
  const ageGroups = data?.ageGroups || [
    { range: "18-24", percentage: 24 },
    { range: "25-34", percentage: 42 },
    { range: "35-44", percentage: 21 },
    { range: "45-54", percentage: 9 },
    { range: "55+", percentage: 4 }
  ];

  const geoDistribution = data?.geoDistribution || [
    { country: "United States", percentage: 38 },
    { country: "United Kingdom", percentage: 16 },
    { country: "Canada", percentage: 12 },
    { country: "Australia", percentage: 8 },
    { country: "Germany", percentage: 7 },
    { country: "Other", percentage: 19 }
  ];

  const progressVariants = {
    initial: { width: 0 },
    animate: (percentage: number) => ({
      width: `${percentage}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-neutral-100 dark:border-neutral-700">
        <CardTitle className="font-heading font-semibold text-base">Audience Overview</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                    <div className="h-3 w-8 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">Age Demographics</h4>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Last 30 days</span>
              </div>
              <div className="space-y-2">
                {ageGroups.map((age, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{age.range}</span>
                      <span className="text-neutral-500 dark:text-neutral-400">{age.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <motion.div 
                        className="h-2 rounded-full bg-[#00B0FF]"
                        custom={age.percentage}
                        variants={progressVariants}
                        initial="initial"
                        animate="animate"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">Geographic Distribution</h4>
              </div>
              <div className="space-y-2">
                {geoDistribution.map((geo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs">{geo.country}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{geo.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm font-medium text-primary dark:text-primary-light hover:underline">
                Detailed Report
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
