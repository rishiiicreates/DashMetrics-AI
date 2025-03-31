import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { apiRequest } from "@/lib/queryClient";

interface WidgetLayout {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: string;
}

interface Layout {
  id: string;
  name: string;
  widgets: WidgetLayout[];
  isDefault: boolean;
}

interface DashboardContextType {
  layout: Layout | null;
  layouts: Layout[];
  selectedLayoutId: string | null;
  isLoading: boolean;
  isCustomizing: boolean;
  saveLayout: (layout: Layout) => Promise<void>;
  createLayout: (name: string) => Promise<void>;
  deleteLayout: (id: string) => Promise<void>;
  setSelectedLayout: (id: string) => void;
  toggleCustomizeMode: () => void;
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
  updateWidgetSize: (id: string, size: { width: number; height: number }) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { user } = useAuth();
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Default layout with common widgets
  const defaultLayout: Layout = {
    id: "default",
    name: "Default Layout",
    isDefault: true,
    widgets: [
      { id: "performance-graph", position: { x: 0, y: 0 }, size: { width: 2, height: 1 }, type: "performance-graph" },
      { id: "ai-insights", position: { x: 2, y: 0 }, size: { width: 1, height: 1 }, type: "ai-insights" },
      { id: "engagement-heatmap", position: { x: 0, y: 1 }, size: { width: 1, height: 1 }, type: "engagement-heatmap" },
      { id: "top-content", position: { x: 1, y: 1 }, size: { width: 1, height: 2 }, type: "top-content" },
      { id: "audience-overview", position: { x: 2, y: 1 }, size: { width: 1, height: 1 }, type: "audience-overview" },
      { id: "competitor-analysis", position: { x: 0, y: 2 }, size: { width: 2, height: 1 }, type: "competitor-analysis" },
      { id: "content-calendar", position: { x: 2, y: 2 }, size: { width: 1, height: 1 }, type: "content-calendar" }
    ]
  };

  const fetchLayouts = async () => {
    if (!user) {
      setLayouts([defaultLayout]);
      setSelectedLayoutId("default");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/dashboard/layouts", undefined);
      const data = await response.json();
      
      if (data.layouts && data.layouts.length > 0) {
        setLayouts(data.layouts);
        
        // Select the default layout or the first one
        const defaultUserLayout = data.layouts.find((l: Layout) => l.isDefault);
        setSelectedLayoutId(defaultUserLayout ? defaultUserLayout.id : data.layouts[0].id);
      } else {
        // No layouts found, use default
        setLayouts([defaultLayout]);
        setSelectedLayoutId("default");
        
        // Save default layout for the user
        await apiRequest("POST", "/api/dashboard/layouts", defaultLayout);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard layouts:", error);
      setLayouts([defaultLayout]);
      setSelectedLayoutId("default");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch layouts on component mount or when user changes
  useEffect(() => {
    fetchLayouts();
  }, [user]);

  // Get the currently selected layout
  const layout = layouts.find(l => l.id === selectedLayoutId) || null;

  // Save layout changes
  const saveLayout = async (updatedLayout: Layout) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await apiRequest("PUT", `/api/dashboard/layouts/${updatedLayout.id}`, updatedLayout);
      
      // Update local state
      setLayouts(layouts.map(l => l.id === updatedLayout.id ? updatedLayout : l));
    } catch (error) {
      console.error("Failed to save layout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new layout
  const createLayout = async (name: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const newLayout: Omit<Layout, "id"> = {
        name,
        isDefault: layouts.length === 0,
        widgets: defaultLayout.widgets
      };
      
      const response = await apiRequest("POST", "/api/dashboard/layouts", newLayout);
      const createdLayout = await response.json();
      
      setLayouts([...layouts, createdLayout]);
      setSelectedLayoutId(createdLayout.id);
    } catch (error) {
      console.error("Failed to create layout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a layout
  const deleteLayout = async (id: string) => {
    if (!user || layouts.length <= 1) return;
    
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/dashboard/layouts/${id}`, undefined);
      
      // Update local state
      const updatedLayouts = layouts.filter(l => l.id !== id);
      setLayouts(updatedLayouts);
      
      // If the deleted layout was selected, select another one
      if (selectedLayoutId === id) {
        setSelectedLayoutId(updatedLayouts[0].id);
      }
    } catch (error) {
      console.error("Failed to delete layout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle customize mode
  const toggleCustomizeMode = () => {
    setIsCustomizing(!isCustomizing);
  };

  // Update widget position
  const updateWidgetPosition = (id: string, position: { x: number; y: number }) => {
    if (!layout) return;
    
    const updatedWidgets = layout.widgets.map(widget => 
      widget.id === id ? { ...widget, position } : widget
    );
    
    const updatedLayout = { ...layout, widgets: updatedWidgets };
    setLayouts(layouts.map(l => l.id === updatedLayout.id ? updatedLayout : l));
  };

  // Update widget size
  const updateWidgetSize = (id: string, size: { width: number; height: number }) => {
    if (!layout) return;
    
    const updatedWidgets = layout.widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    );
    
    const updatedLayout = { ...layout, widgets: updatedWidgets };
    setLayouts(layouts.map(l => l.id === updatedLayout.id ? updatedLayout : l));
  };

  const value = {
    layout,
    layouts,
    selectedLayoutId,
    isLoading,
    isCustomizing,
    saveLayout,
    createLayout,
    deleteLayout,
    setSelectedLayout: setSelectedLayoutId,
    toggleCustomizeMode,
    updateWidgetPosition,
    updateWidgetSize
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
