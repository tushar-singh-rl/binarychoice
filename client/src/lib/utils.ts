import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDuration(startTime: Date, endTime: Date): string {
  const diff = endTime.getTime() - startTime.getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes} min ${seconds}s`;
}

export function getQuestionTypeLabels(type: string): { positive: string; negative: string; icon: string } {
  switch (type) {
    case 'yes-no':
      return { positive: 'Yes', negative: 'No', icon: 'fas fa-thumbs-up' };
    case 'true-false':
      return { positive: 'True', negative: 'False', icon: 'fas fa-check' };
    case 'agree-disagree':
      return { positive: 'Agree', negative: 'Disagree', icon: 'fas fa-thumbs-up' };
    default:
      return { positive: 'Yes', negative: 'No', icon: 'fas fa-thumbs-up' };
  }
}

export function getQuestionCategoryDisplay(category: string | null): string {
  if (!category) return 'General Question';
  return `${category} Question`;
}
