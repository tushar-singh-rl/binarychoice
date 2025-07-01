import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { generateSessionId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { QuizHeader } from "@/components/quiz-header";
import { ProgressBar } from "@/components/progress-bar";
import { QuestionCard } from "@/components/question-card";
import { QuestionList } from "@/components/question-list";
import { ResultsModal } from "@/components/results-modal";
import { FloatingActions } from "@/components/floating-actions";
import type { Question, QuizResponse, QuizSession } from "@shared/schema";

export default function Quiz() {
  const [sessionId] = useState(() => generateSessionId());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListView, setIsListView] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const { toast } = useToast();

  // Fetch questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  // Fetch quiz session
  const { data: session } = useQuery<QuizSession>({
    queryKey: ["/api/quiz/session", sessionId],
    enabled: false, // We'll refetch manually after creating session
  });

  // Fetch responses
  const { data: responses = [] } = useQuery<QuizResponse[]>({
    queryKey: ["/api/quiz/responses", sessionId],
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/quiz/session", sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/session", sessionId] });
    },
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      const response = await apiRequest("POST", "/api/quiz/answer", answerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/responses", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/session", sessionId] });
    },
  });

  // Complete quiz mutation
  const completeQuizMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/quiz/complete/${sessionId}`, {});
      return response.json();
    },
    onSuccess: (data) => {
      setQuizResults(data);
      setShowResults(true);
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/session", sessionId] });
    },
  });

  // Initialize session when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !session) {
      createSessionMutation.mutate({
        sessionId,
        totalQuestions: questions.length,
      });
    }
  }, [questions, session, sessionId]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    submitAnswerMutation.mutate({
      sessionId,
      questionId,
      answer,
    });

    toast({
      title: "Answer Saved",
      description: "Your answer has been recorded.",
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = () => {
    completeQuizMutation.mutate();
  };

  const handleSaveProgress = () => {
    toast({
      title: "Progress Saved",
      description: "Your quiz progress has been saved automatically.",
    });
  };

  const handleResetQuiz = () => {
    if (confirm("Are you sure you want to reset the quiz? All answers will be lost.")) {
      // In a real app, you'd create a new session
      setCurrentQuestionIndex(0);
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/responses", sessionId] });
      toast({
        title: "Quiz Reset",
        description: "The quiz has been reset to the beginning.",
      });
    }
  };

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <QuizHeader
        onToggleView={() => setIsListView(!isListView)}
        isListView={isListView}
      />

      <ProgressBar
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isListView ? (
          <QuestionList
            questions={questions}
            responses={responses}
            currentQuestionIndex={currentQuestionIndex}
            onToggleView={() => setIsListView(false)}
            onAnswerSelect={handleAnswerSelect}
            onSubmitQuiz={handleSubmitQuiz}
          />
        ) : (
          currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={currentResponse?.answer}
              onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion.id, answer)}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSkip={handleSkip}
              canGoPrevious={currentQuestionIndex > 0}
              canGoNext={currentQuestionIndex < questions.length - 1}
            />
          )
        )}
      </main>

      <FloatingActions
        onSaveProgress={handleSaveProgress}
        onResetQuiz={handleResetQuiz}
      />

      {showResults && quizResults && (
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          session={quizResults.session}
          responses={quizResults.responses}
          summary={quizResults.summary}
        />
      )}
    </div>
  );
}
