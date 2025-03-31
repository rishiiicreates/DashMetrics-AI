import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const EmptyState = () => {
  const handleGetStarted = () => {
    // This could trigger a modal or navigate to a documentation page
    console.log("Get started clicked");
  };

  return (
    <div className="px-4 py-5 bg-white border border-gray-200 border-dashed rounded-lg sm:px-6">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PlusIcon className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Ready for development</h3>
        <p className="mt-1 text-sm text-gray-500">This is your empty template ready for SAAS development.</p>
        <div className="mt-6">
          <Button 
            onClick={handleGetStarted}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
