interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const progress = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-sm text-neutral">{progress}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
