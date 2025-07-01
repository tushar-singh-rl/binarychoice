import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Download, X } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { QuizSession, QuizResponse } from "@shared/schema";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: QuizSession;
  responses: QuizResponse[];
  summary: {
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
    startedAt: Date;
    completedAt: Date;
  };
}

export function ResultsModal({
  isOpen,
  onClose,
  session,
  responses,
  summary,
}: ResultsModalProps) {
  const handleDownloadResults = () => {
    const results = {
      session,
      responses,
      summary,
    };
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-results-${session.sessionId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const timeTaken = summary.completedAt && summary.startedAt 
    ? formatDuration(summary.startedAt, summary.completedAt)
    : 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-success to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Quiz Completed!
          </DialogTitle>
          <p className="text-neutral">
            Thank you for participating in our binary quiz.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-slate-200">
            <span className="text-slate-600">Questions Answered:</span>
            <span className="font-semibold text-slate-900">
              {summary.answeredQuestions}/{summary.totalQuestions}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-200">
            <span className="text-slate-600">Completion Rate:</span>
            <span className="font-semibold text-slate-900">
              {summary.completionRate}%
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600">Time Taken:</span>
            <span className="font-semibold text-slate-900">
              {timeTaken}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={handleDownloadResults}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
