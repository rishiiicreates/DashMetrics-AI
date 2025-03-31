import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  Zap, 
  Target, 
  AlertTriangle,
  PlusCircle,
  Sparkles,
  BookOpen,
  BarChart as BarChartIcon,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";
import { useCompetitorAnalysis, useContentGapAnalysis } from "@/hooks/useCompetitorAnalysis";
import { useCompetitorData } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";

const COLORS = {
  low: "#4CAF50",
  medium: "#FF9800",
  high: "#F44336",
  above_average: "#4CAF50",
  below_average: "#F44336",
  leading: "#2196F3",
};

const CompetitorInsightItem = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="space-y-2 mb-6">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary/10 rounded-md text-primary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="ml-10">{children}</div>
  </div>
);

const DifficultyBadge = ({ level }: { level: "low" | "medium" | "high" }) => {
  const getColor = () => {
    if (level === "low") return "text-green-600 bg-green-100";
    if (level === "medium") return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

export default function CompetitorAnalysisPanel() {
  const [platform, setPlatform] = useState<string>("all");
  const { data: competitorData, isLoading: isLoadingCompetitors } = useCompetitorData();
  const { data: analysis, isLoading, error } = useCompetitorAnalysis(platform !== "all" ? platform : undefined);
  const { data: contentGaps, isLoading: isLoadingGaps } = useContentGapAnalysis(platform !== "all" ? platform : undefined);
  const { toast } = useToast();
  
  const handleRefreshAnalysis = () => {
    toast({
      title: "Refreshing analysis",
      description: "Generating a new competitor analysis with the latest data...",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Advanced Competitor Analysis</span>
            </CardTitle>
            <CardDescription>
              AI-powered insights about your competitors and market positioning
            </CardDescription>
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col">
        <div className="px-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChartIcon className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Opportunities</span>
            </TabsTrigger>
            <TabsTrigger value="content-gaps" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Content Gaps</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="flex-1 pt-3 px-0 overflow-hidden">
          <TabsContent value="overview" className="m-0 h-full flex flex-col overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-32" />
              </div>
            ) : error ? (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load competitor analysis. Please try again later.
                  </AlertDescription>
                </Alert>
              </div>
            ) : analysis ? (
              <ScrollArea className="h-full pr-6">
                <div className="p-6 pb-0">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Executive Summary</h3>
                    <p className="text-gray-600 dark:text-gray-400">{analysis.summary}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Performance Comparison</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{analysis.comparison.overallPosition}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {analysis.comparison.keyMetrics.map((metric, i) => (
                        <Card key={i} className="border-l-4" style={{ borderLeftColor: COLORS[metric.status] }}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold">{metric.name}</h4>
                            <div className="flex justify-between mt-2">
                              <div>
                                <div className="text-sm text-gray-500">Your Value</div>
                                <div className="text-xl font-bold">{metric.userValue.toFixed(1)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Industry Avg</div>
                                <div className="text-xl font-bold">{metric.industryAverage.toFixed(1)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Top Competitor</div>
                                <div className="text-xl font-bold">{metric.topCompetitorValue.toFixed(1)}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {!isLoadingCompetitors && competitorData && (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart
                          data={competitorData.competitors}
                          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `${value}%`} />
                          <Tooltip formatter={(value) => [`${value}%`, "Engagement Rate"]} />
                          <Bar dataKey="engagementRate" name="Engagement Rate">
                            {competitorData.competitors.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">Competitor Analysis</h3>
                  <div className="space-y-4 mb-6">
                    {analysis.competitors.map((competitor, i) => (
                      <Card key={i}>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg">{competitor.name}</CardTitle>
                          <CardDescription>{competitor.contentStrategy}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold flex items-center gap-1 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Strengths
                              </h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {competitor.strengths.map((strength, j) => (
                                  <li key={j}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold flex items-center gap-1 mb-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                Weaknesses
                              </h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {competitor.weaknesses.map((weakness, j) => (
                                  <li key={j}>{weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="font-semibold mb-1">Unique Value Proposition</h4>
                            <p className="text-sm">{competitor.uniqueValue}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">No competitor analysis available.</p>
                <Button onClick={handleRefreshAnalysis}>Generate Analysis</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="opportunities" className="m-0 h-full flex flex-col overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-2/3 h-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Skeleton className="w-full h-48" />
                  <Skeleton className="w-full h-48" />
                  <Skeleton className="w-full h-48" />
                  <Skeleton className="w-full h-48" />
                </div>
              </div>
            ) : error ? (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load opportunities analysis. Please try again later.
                  </AlertDescription>
                </Alert>
              </div>
            ) : analysis ? (
              <ScrollArea className="h-full pr-6">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Strategic Opportunities</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Based on competitor analysis, here are key opportunities for growth and competitive advantage.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {analysis.opportunities.map((opportunity, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-1.5 w-full" style={{ backgroundColor: COLORS[opportunity.potentialImpact] }}></div>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                Impact: <span className="ml-1 font-semibold">{opportunity.potentialImpact}</span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Difficulty: <span className="ml-1 font-semibold">{opportunity.difficulty}</span>
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm mb-3">{opportunity.description}</p>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Recommended Actions:</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {opportunity.recommendedActions.map((action, j) => (
                                <li key={j}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Potential Threats</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Be aware of these competitive challenges that might impact your performance.
                    </p>
                    
                    <div className="space-y-4">
                      {analysis.threats.map((threat, i) => (
                        <Card key={i}>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                {threat.title}
                              </CardTitle>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  Severity: <span className="ml-1 font-semibold">{threat.severity}</span>
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Probability: <span className="ml-1 font-semibold">{threat.probability}</span>
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm mb-3">{threat.description}</p>
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Mitigation Strategies:</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {threat.mitigationStrategies.map((strategy, j) => (
                                  <li key={j}>{strategy}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Audience Insights</h3>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <ul className="list-disc list-inside space-y-2">
                        {analysis.audienceInsights.map((insight, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">No opportunity analysis available.</p>
                <Button onClick={handleRefreshAnalysis}>Generate Analysis</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="content-gaps" className="m-0 h-full flex flex-col overflow-hidden">
            {isLoadingGaps ? (
              <div className="p-6 space-y-4">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-2/3 h-4" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <Skeleton className="w-full h-48" />
                  <Skeleton className="w-full h-48" />
                </div>
                <Skeleton className="w-full h-64" />
              </div>
            ) : !contentGaps ? (
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">No content gap analysis available.</p>
                <Button onClick={handleRefreshAnalysis}>Generate Analysis</Button>
              </div>
            ) : (
              <ScrollArea className="h-full pr-6">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Content Gap Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{contentGaps.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">Missing Content Formats</CardTitle>
                        <CardDescription>
                          Formats your competitors are leveraging that you haven't explored
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {contentGaps.missingFormats.map((format, i) => (
                            <Badge key={i} variant="secondary">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">Underutilized Themes</CardTitle>
                        <CardDescription>
                          Content themes with growth potential based on competitor success
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {contentGaps.underutilizedThemes.map((theme, i) => (
                            <Badge key={i} variant="secondary">
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Specific Content Gaps</h3>
                    <div className="space-y-4">
                      {contentGaps.contentGaps.map((gap, i) => (
                        <Card key={i}>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge className="mb-1">{gap.category}</Badge>
                                <CardTitle className="text-lg">{gap.title}</CardTitle>
                              </div>
                              <div className="flex gap-1">
                                <DifficultyBadge level={gap.difficulty} />
                                <Badge variant="outline" className="text-xs">
                                  Value: <span className="ml-1 font-semibold">{gap.potentialValue}</span>
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm mb-3">{gap.description}</p>
                            
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold mb-2">Competitor Examples:</h4>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {gap.competitorExamples.map((example, j) => (
                                  <li key={j}>{example}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Recommended Approach:</h4>
                              <p className="text-sm">{gap.recommendedApproach}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recommended Content Calendar
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Based on content gaps, here's a strategic content plan to help you gain competitive advantage.
                    </p>
                    
                    <div className="space-y-6">
                      {contentGaps.recommendedContentCalendar.map((week, i) => (
                        <div key={i}>
                          <h4 className="text-lg font-medium mb-2">Week {week.week}: {week.focus}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {week.contentPieces.map((piece, j) => (
                              <Card key={j} className="bg-muted/30">
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-xs">{piece.platform}</Badge>
                                    <Badge variant="outline" className="text-xs">{piece.format}</Badge>
                                  </div>
                                  <p className="font-medium">{piece.title}</p>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {piece.targetMetrics.map((metric, k) => (
                                      <Badge key={k} variant="secondary" className="text-xs">
                                        {metric}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}