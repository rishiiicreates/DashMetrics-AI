import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type ProjectStructureItem = {
  path: string;
  description: string;
};

const projectStructureItems: ProjectStructureItem[] = [
  {
    path: "src/components/",
    description: "Reusable UI components"
  },
  {
    path: "src/pages/",
    description: "Page components that represent routes"
  },
  {
    path: "src/layout/",
    description: "Layout components (Sidebar, Header, etc.)"
  },
  {
    path: "src/hooks/",
    description: "Custom React hooks"
  },
  {
    path: "src/utils/",
    description: "Utility functions and helpers"
  },
  {
    path: "src/services/",
    description: "API service integrations"
  },
  {
    path: "src/context/",
    description: "React context providers"
  },
  {
    path: "src/assets/",
    description: "Static assets (images, icons, etc.)"
  }
];

const ProjectStructure = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Project Structure</CardTitle>
        <CardDescription>This shows the recommended React project file organization.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <dl>
          {projectStructureItems.map((item, index) => (
            <div key={index} className={`px-4 py-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
              <dt className="text-sm font-medium text-gray-500">{item.path}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.description}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

export default ProjectStructure;
