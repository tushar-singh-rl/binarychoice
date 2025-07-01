import { 
  questions, 
  quizResponses, 
  quizSessions,
  type Question, 
  type InsertQuestion,
  type QuizResponse,
  type InsertQuizResponse,
  type QuizSession,
  type InsertQuizSession
} from "@shared/schema";

export interface IStorage {
  // Questions
  getQuestions(): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Quiz Sessions
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  getQuizSession(sessionId: string): Promise<QuizSession | undefined>;
  updateQuizSession(sessionId: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined>;
  
  // Quiz Responses
  createQuizResponse(response: InsertQuizResponse): Promise<QuizResponse>;
  getQuizResponses(sessionId: string): Promise<QuizResponse[]>;
  getQuizResponse(sessionId: string, questionId: number): Promise<QuizResponse | undefined>;
}

export class MemStorage implements IStorage {
  private questions: Map<number, Question>;
  private quizSessions: Map<string, QuizSession>;
  private quizResponses: Map<string, QuizResponse>;
  private currentQuestionId: number;
  private currentResponseId: number;
  private currentSessionId: number;

  constructor() {
    this.questions = new Map();
    this.quizSessions = new Map();
    this.quizResponses = new Map();
    this.currentQuestionId = 1;
    this.currentResponseId = 1;
    this.currentSessionId = 1;
    
    // Initialize with sample questions
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const sampleQuestions: InsertQuestion[] = [
      {
        text: "Is climate change primarily caused by human activities?",
        type: "true-false",
        category: "Environment",
        required: true,
        order: 1,
      },
      {
        text: "Should social media platforms have more regulation?",
        type: "yes-no",
        category: "Technology",
        required: true,
        order: 2,
      },
      {
        text: "Do you believe artificial intelligence will have a positive impact on society in the next decade?",
        type: "agree-disagree",
        category: "Technology",
        required: true,
        order: 3,
      },
      {
        text: "Is remote work more productive than office work?",
        type: "true-false",
        category: "Work",
        required: true,
        order: 4,
      },
      {
        text: "Should healthcare be free for everyone?",
        type: "yes-no",
        category: "Healthcare",
        required: true,
        order: 5,
      },
      {
        text: "Do you agree that renewable energy should be prioritized over fossil fuels?",
        type: "agree-disagree",
        category: "Environment",
        required: true,
        order: 6,
      },
      {
        text: "Is online education as effective as traditional classroom learning?",
        type: "true-false",
        category: "Education",
        required: true,
        order: 7,
      },
      {
        text: "Should there be a universal basic income?",
        type: "yes-no",
        category: "Economics",
        required: true,
        order: 8,
      },
      {
        text: "Do you believe that privacy is more important than security?",
        type: "agree-disagree",
        category: "Privacy",
        required: true,
        order: 9,
      },
      {
        text: "Is genetic engineering in humans ethical?",
        type: "true-false",
        category: "Ethics",
        required: true,
        order: 10,
      },
    ];

    sampleQuestions.forEach(question => {
      const id = this.currentQuestionId++;
      this.questions.set(id, { ...question, id });
    });
  }

  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => a.order - b.order);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = this.currentSessionId++;
    const session: QuizSession = {
      ...insertSession,
      id,
      startedAt: new Date(),
      completedAt: null,
    };
    this.quizSessions.set(insertSession.sessionId, session);
    return session;
  }

  async getQuizSession(sessionId: string): Promise<QuizSession | undefined> {
    return this.quizSessions.get(sessionId);
  }

  async updateQuizSession(sessionId: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined> {
    const session = this.quizSessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.quizSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async createQuizResponse(insertResponse: InsertQuizResponse): Promise<QuizResponse> {
    const id = this.currentResponseId++;
    const responseKey = `${insertResponse.sessionId}-${insertResponse.questionId}`;
    
    const response: QuizResponse = {
      ...insertResponse,
      id,
      answeredAt: new Date(),
    };
    
    this.quizResponses.set(responseKey, response);
    return response;
  }

  async getQuizResponses(sessionId: string): Promise<QuizResponse[]> {
    return Array.from(this.quizResponses.values()).filter(
      response => response.sessionId === sessionId
    );
  }

  async getQuizResponse(sessionId: string, questionId: number): Promise<QuizResponse | undefined> {
    const responseKey = `${sessionId}-${questionId}`;
    return this.quizResponses.get(responseKey);
  }
}

export const storage = new MemStorage();
