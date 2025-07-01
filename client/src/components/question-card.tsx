import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { getQuestionTypeLabels, getQuestionCategoryDisplay } from "@/lib/utils";
import type { Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  onSkip,
  canGoPrevious,
  canGoNext,
}: QuestionCardProps) {
  const labels = getQuestionTypeLabels(question.type);
  const categoryDisplay = getQuestionCategoryDisplay(question.category);

  const getButtonIcon = (isPositive: boolean) => {
    switch (question.type) {
      case 'true-false':
        return isPositive ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />;
      case 'agree-disagree':
      case 'yes-no':
      default:
        return isPositive ? <ThumbsUp className="w-5 h-5" /> : <ThumbsDown className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <span>{questionNumber}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight mb-6">
                {question.text}
              </h2>
              
              {/* Binary Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Button
                  onClick={() => onAnswerSelect(question.type === 'true-false' ? 'true' : 
                                               question.type === 'agree-disagree' ? 'agree' : 'yes')}
                  className={`group relative h-auto py-4 px-6 ${
                    selectedAnswer === (question.type === 'true-false' ? 'true' : 
                                      question.type === 'agree-disagree' ? 'agree' : 'yes')
                      ? 'bg-gradient-to-r from-success to-emerald-600 text-white ring-4 ring-white ring-opacity-50'
                      : 'bg-gradient-to-r from-success to-emerald-600 hover:from-emerald-600 hover:to-success text-white'
                  } font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {getButtonIcon(true)}
                    <span className="text-lg">{labels.positive}</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" />
                </Button>
                
                <Button
                  onClick={() => onAnswerSelect(question.type === 'true-false' ? 'false' : 
                                               question.type === 'agree-disagree' ? 'disagree' : 'no')}
                  className={`group relative h-auto py-4 px-6 ${
                    selectedAnswer === (question.type === 'true-false' ? 'false' : 
                                      question.type === 'agree-disagree' ? 'disagree' : 'no')
                      ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white ring-4 ring-white ring-opacity-50'
                      : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white'
                  } font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {getButtonIcon(false)}
                    <span className="text-lg">{labels.negative}</span>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" />
                </Button>
              </div>
              
              {/* Question Type Indicator */}
              <div className="flex items-center space-x-2 text-sm text-neutral">
                <i className="fas fa-tag" />
                <span>{categoryDisplay}</span>
                <span className="text-slate-300">•</span>
                <span>Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="px-4 py-2 text-sm"
          >
            Skip Question
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center space-x-2 px-6 py-3"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
