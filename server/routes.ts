import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResponseSchema, insertQuizSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Create quiz session
  app.post("/api/quiz/session", async (req, res) => {
    try {
      const sessionData = insertQuizSessionSchema.parse(req.body);
      const session = await storage.createQuizSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create quiz session" });
      }
    }
  });

  // Get quiz session
  app.get("/api/quiz/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getQuizSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Quiz session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz session" });
    }
  });

  // Update quiz session
  app.patch("/api/quiz/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      
      const session = await storage.updateQuizSession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ error: "Quiz session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update quiz session" });
    }
  });

  // Submit answer
  app.post("/api/quiz/answer", async (req, res) => {
    try {
      const responseData = insertQuizResponseSchema.parse(req.body);
      
      // Check if answer already exists and update it
      const existingResponse = await storage.getQuizResponse(
        responseData.sessionId, 
        responseData.questionId
      );
      
      const response = await storage.createQuizResponse(responseData);
      
      // Update session answered count if this is a new answer
      if (!existingResponse) {
        const session = await storage.getQuizSession(responseData.sessionId);
        if (session) {
          await storage.updateQuizSession(responseData.sessionId, {
            answeredQuestions: session.answeredQuestions + 1
          });
        }
      }
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid response data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit answer" });
      }
    }
  });

  // Get quiz responses for a session
  app.get("/api/quiz/responses/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const responses = await storage.getQuizResponses(sessionId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz responses" });
    }
  });

  // Complete quiz session
  app.post("/api/quiz/complete/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.updateQuizSession(sessionId, {
        completedAt: new Date()
      });
      
      if (!session) {
        return res.status(404).json({ error: "Quiz session not found" });
      }
      
      const responses = await storage.getQuizResponses(sessionId);
      
      res.json({
        session,
        responses,
        summary: {
          totalQuestions: session.totalQuestions,
          answeredQuestions: session.answeredQuestions,
          completionRate: Math.round((session.answeredQuestions / session.totalQuestions) * 100),
          startedAt: session.startedAt,
          completedAt: session.completedAt,
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to complete quiz" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
