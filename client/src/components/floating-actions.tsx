import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";

interface FloatingActionsProps {
  onSaveProgress: () => void;
  onResetQuiz: () => void;
}

export function FloatingActions({ onSaveProgress, onResetQuiz }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onSaveProgress}
        className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Save className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onResetQuiz}
        className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
    </div>
  );
}
