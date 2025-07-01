import { Button } from "@/components/ui/button";
import { List, HelpCircle } from "lucide-react";

interface QuizHeaderProps {
  onToggleView: () => void;
  isListView: boolean;
}

export function QuizHeader({ onToggleView, isListView }: QuizHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <HelpCircle className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Binary Quiz</h1>
              <p className="text-sm text-neutral">Interactive Q&A Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleView}
              className="hidden sm:flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>{isListView ? 'Single View' : 'List View'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
