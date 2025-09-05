import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

interface PlaceholderProps {
  title: string;
  message?: string;
}

export default function Placeholder({ title, message = "This page is coming soon. Continue prompting to add content here." }: PlaceholderProps) {
  return (
    <div className="flex w-screen h-screen bg-promag-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header title={title} />

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-5 gap-5 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-semibold text-promag-body font-manrope">
              {title}
            </h2>
            <p className="text-promag-body/70 font-inter max-w-md">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
