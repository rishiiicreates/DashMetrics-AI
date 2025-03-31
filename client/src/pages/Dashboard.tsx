import EmptyState from "@/components/EmptyState";
import ProjectStructure from "@/components/ProjectStructure";
import TechStackGuide from "@/components/TechStackGuide";

const Dashboard = () => {
  return (
    <>
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      {/* Page Content */}
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <EmptyState />
          <ProjectStructure />
          <TechStackGuide />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
