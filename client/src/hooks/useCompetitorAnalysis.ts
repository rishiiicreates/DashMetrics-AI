import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

export interface CompetitorAnalysis {
  summary: string;
  comparison: {
    overallPosition: string;
    keyMetrics: {
      name: string;
      userValue: number;
      industryAverage: number;
      topCompetitorValue: number;
      topCompetitor: string;
      status: "above_average" | "below_average" | "leading";
    }[];
  };
  competitors: {
    name: string;
    strengths: string[];
    weaknesses: string[];
    contentStrategy: string;
    uniqueValue: string;
  }[];
  opportunities: {
    title: string;
    description: string;
    difficulty: "low" | "medium" | "high";
    potentialImpact: "low" | "medium" | "high";
    recommendedActions: string[];
  }[];
  threats: {
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    probability: "low" | "medium" | "high";
    mitigationStrategies: string[];
  }[];
  contentGaps: string[];
  audienceInsights: string[];
}

export interface ContentGapAnalysis {
  summary: string;
  contentGaps: {
    category: string;
    title: string;
    description: string;
    competitorExamples: string[];
    recommendedApproach: string;
    potentialValue: "high" | "medium" | "low";
    difficulty: "high" | "medium" | "low";
  }[];
  missingFormats: string[];
  underutilizedThemes: string[];
  recommendedContentCalendar: {
    week: number;
    focus: string;
    contentPieces: {
      title: string;
      format: string;
      platform: string;
      targetMetrics: string[];
    }[];
  }[];
}

export function useCompetitorAnalysis(platform?: string): UseQueryResult<CompetitorAnalysis> {
  return useQuery({
    queryKey: ['/api/analytics/competitors/analysis', platform],
    enabled: true,
  });
}

export function useContentGapAnalysis(platform?: string): UseQueryResult<ContentGapAnalysis> {
  return useQuery({
    queryKey: ['/api/analytics/competitors/content-gaps', platform],
    enabled: true,
  });
}

export function invalidateCompetitorAnalyses() {
  queryClient.invalidateQueries({ queryKey: ['/api/analytics/competitors'] });
  queryClient.invalidateQueries({ queryKey: ['/api/analytics/competitors/analysis'] });
  queryClient.invalidateQueries({ queryKey: ['/api/analytics/competitors/content-gaps'] });
}