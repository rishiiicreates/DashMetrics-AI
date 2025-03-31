import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

export interface CompetitorData {
  id: number;
  name: string;
  engagementRate: number;
  barHeight: number;
  color: string;
}

interface PlatformGrowth {
  name: string;
  growth: number;
  followers: number;
}

interface AudienceData {
  totalAudience: number;
  audienceGrowth: number;
  platforms: PlatformGrowth[];
  demographics: {
    ageGroups: { age: string; percentage: number }[];
    genders: { gender: string; percentage: number }[];
    locations: { country: string; percentage: number }[];
  };
  interests: { name: string; percentage: number }[];
  activeHours: { hour: number; value: number }[];
  activeDays: { day: string; value: number }[];
}

export interface CompetitorDataResponse {
  competitors: CompetitorData[];
  insights: {
    id: number;
    title: string;
    description: string;
    icon: "zap" | "target";
  }[];
}

export function useCompetitorData(): UseQueryResult<CompetitorDataResponse> {
  return useQuery({
    queryKey: ['/api/analytics/competitors'],
    enabled: true,
  });
}

export function useAudienceData(): UseQueryResult<AudienceData> {
  return useQuery({
    queryKey: ['/api/analytics/audience'],
    enabled: true,
  });
}

export function usePerformanceData(timeframe: string = 'monthly'): UseQueryResult<any> {
  return useQuery({
    queryKey: ['/api/analytics/performance', timeframe],
    enabled: true,
  });
}

export function useHeatmapData(): UseQueryResult<any> {
  return useQuery({
    queryKey: ['/api/analytics/heatmap'],
    enabled: true,
  });
}

export function useTopContent(limit?: number): UseQueryResult<any> {
  return useQuery({
    queryKey: ['/api/content/top', limit],
    enabled: true,
  });
}

export function invalidateAnalytics() {
  queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
}