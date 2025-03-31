import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

export default function NaturalLanguageSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("Ask anything about your analytics...");
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Fetch search results 
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', searchQuery],
    enabled: !!searchQuery && searchQuery.length > 2,
  });
  
  // Update placeholder on focus
  const handleFocus = () => {
    setIsFocused(true);
    setPlaceholder('Try "What was my best performing post last month?"');
  };
  
  const handleBlur = () => {
    setPlaceholder("Ask anything about your analytics...");
  };
  
  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
            isFocused && "w-full shadow-sm"
          )}
        />
        <div className="absolute left-3 top-2.5 text-neutral-400">
          <Search className="h-5 w-5" />
        </div>
      </div>
      
      <AnimatePresence>
        {isFocused && searchQuery.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="inline-block h-5 w-5 rounded-full border-2 border-r-transparent border-primary animate-spin"></div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Processing your question...</p>
              </div>
            ) : searchResults ? (
              <div>
                <div className="p-3 border-b border-neutral-100 dark:border-neutral-700">
                  <p className="text-sm font-medium">Results for "{searchQuery}"</p>
                </div>
                <div className="p-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {searchResults as string || "No results found. Try a different question."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Ask me questions like:
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm text-primary dark:text-primary-light hover:underline cursor-pointer">
                    "Show my best performing posts this month"
                  </li>
                  <li className="text-sm text-primary dark:text-primary-light hover:underline cursor-pointer">
                    "What type of content gets the most engagement?"
                  </li>
                  <li className="text-sm text-primary dark:text-primary-light hover:underline cursor-pointer">
                    "When is the best time to post on Instagram?"
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
