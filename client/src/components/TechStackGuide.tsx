import { 
  Paintbrush, 
  Cloud, 
  Zap 
} from "lucide-react";

type TechStackItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
};

const techStackItems: TechStackItem[] = [
  {
    title: "Styling",
    description: "Options: CSS Modules, Styled Components, or Tailwind CSS",
    icon: <Paintbrush className="w-6 h-6 text-white" />,
    bgColor: "bg-primary-500"
  },
  {
    title: "State Management",
    description: "Options: React Context, Redux, or Zustand",
    icon: <Cloud className="w-6 h-6 text-white" />,
    bgColor: "bg-secondary-500"
  },
  {
    title: "Routing",
    description: "React Router with configuration in App.js",
    icon: <Zap className="w-6 h-6 text-white" />,
    bgColor: "bg-accent-500"
  }
];

const TechStackGuide = () => {
  return (
    <div className="grid grid-cols-1 gap-5 mt-8 md:grid-cols-2 lg:grid-cols-3">
      {techStackItems.map((item, index) => (
        <div key={index} className="overflow-hidden bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 ${item.bgColor} rounded-md`}>
                {item.icon}
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{item.title}</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStackGuide;
