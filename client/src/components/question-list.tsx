import { Button } from "@/components/ui/button";
import { Check, Clock, Circle, Eye, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { getQuestionTypeLabels } from "@/lib/utils";
import type { Question, QuizResponse } from "@shared/schema";

interface QuestionListProps {
  questions: Question[];
  responses: QuizResponse[];
  currentQuestionIndex: number;
  onToggleView: () => void;
  onAnswerSelect: (questionId: number, answer: string) => void;
  onSubmitQuiz: () => void;
}

export function QuestionList({
  questions,
  responses,
  currentQuestionIndex,
  onToggleView,
  onAnswerSelect,
  onSubmitQuiz,
}: QuestionListProps) {
  const getResponseForQuestion = (questionId: number) => {
    return responses.find(response => response.questionId === questionId);
  };

  const getQuestionStatus = (questionIndex: number, questionId: number) => {
    const response = getResponseForQuestion(questionId);
    if (response) return 'answered';
    if (questionIndex === currentQuestionIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <Check className="w-4 h-4 text-success" />;
      case 'current':
        return <Circle className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered':
        return { text: 'Answered', className: 'text-success' };
      case 'current':
        return { text: 'Current', className: 'text-blue-600' };
      default:
        return { text: 'Pending', className: 'text-warning' };
    }
  };

  const getAnswerButtons = (question: Question, response?: QuizResponse) => {
    const labels = getQuestionTypeLabels(question.type);
    const positiveAnswer = question.type === 'true-false' ? 'true' : 
                          question.type === 'agree-disagree' ? 'agree' : 'yes';
    const negativeAnswer = question.type === 'true-false' ? 'false' : 
                          question.type === 'agree-disagree' ? 'disagree' : 'no';

    const getButtonIcon = (isPositive: boolean) => {
      switch (question.type) {
        case 'true-false':
          return isPositive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />;
        case 'agree-disagree':
        case 'yes-no':
        default:
          return isPositive ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />;
      }
    };

    return (
      <div className="flex space-x-3">
        <Button
          onClick={() => onAnswerSelect(question.id, positiveAnswer)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            response?.answer === positiveAnswer
              ? 'bg-success text-white'
              : response
              ? 'bg-slate-100 text-slate-600'
              : 'bg-slate-100 hover:bg-success hover:text-white text-slate-600 border-2 border-dashed border-slate-300'
          }`}
        >
          {getButtonIcon(true)}
          <span className="ml-2">{labels.positive}</span>
        </Button>
        <Button
          onClick={() => onAnswerSelect(question.id, negativeAnswer)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            response?.answer === negativeAnswer
              ? 'bg-slate-500 text-white'
              : response
              ? 'bg-slate-100 text-slate-600'
              : 'bg-slate-100 hover:bg-slate-500 hover:text-white text-slate-600 border-2 border-dashed border-slate-300'
          }`}
        >
          {getButtonIcon(false)}
          <span className="ml-2">{labels.negative}</span>
        </Button>
      </div>
    );
  };

  const answeredCount = responses.length;
  const totalQuestions = questions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">All Questions</h2>
        <Button
          variant="secondary"
          onClick={onToggleView}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Single View</span>
        </Button>
      </div>

      {questions.map((question, index) => {
        const response = getResponseForQuestion(question.id);
        const status = getQuestionStatus(index, question.id);
        const statusInfo = getStatusText(status);

        return (
          <div
            key={question.id}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {question.text}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(status)}
                <span className={`text-sm font-medium ${statusInfo.className}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
            <div className="ml-11 space-y-3">
              {getAnswerButtons(question, response)}
            </div>
          </div>
        );
      })}

      {/* Submit Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Ready to Submit?</h3>
            <p className="text-blue-100">
              You've answered {answeredCount} out of {totalQuestions} questions
            </p>
          </div>
          <Button
            onClick={onSubmitQuiz}
            className="bg-white text-primary hover:bg-slate-50 shadow-sm"
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
