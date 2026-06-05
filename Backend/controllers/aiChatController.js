import ErrorHandler from "../middlewear/errorMiddlewear.js";
import { Chat } from "../Models/chatModel.js";
import { Book } from "../Models/bookModel.js";
import { UserPreference } from "../Models/UserPreferenceModel.js";
import { generateAIResponse } from "../services/aiService.js";
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";
import User from "../Models/UserModel.js";

export const chatWithAI = catchAsynError(async (req, res, next) => {
    const { message } = req.body;

    // 1. Validation using project's ErrorHandler pattern
    if (!message || !message.trim()) {
        return next(new ErrorHandler("Message is required", 400));
    }

    if (!req.user || !req.user._id) {
        return next(new ErrorHandler("User session not found. Please log in again.", 401));
    }

    const userId = req.user._id;

    // Fetch User and Borrow History
    const user = await User.findById(userId)
        .populate({
            path: "borrowedBooks.bookId",
            select: "title author genre",
        })
        .lean();

    const borrowHistory = user?.borrowedBooks?.length
        ? user.borrowedBooks
              .map((b) => b.bookId?.title || b.BookTitle)
              .join(", ")
        : "No borrowing history";

    // Fetch History and Preferences
    const history = await Chat.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const preference = await UserPreference.findOne({ user: userId }).lean();

    // -------------------------
    // 2. User Profile Detection
    // -------------------------
    const profilePrompt = `
Analyze the user message and return ONLY valid JSON.
Format: { "emotion": "", "goal": "", "difficulty": "" }
Examples:
"I want to learn React" -> { "emotion":"curious", "goal":"react", "difficulty":"Beginner" }
"I need advanced system design books" -> { "emotion":"motivated", "goal":"system design", "difficulty":"Advanced" }
User Message: "${message}"
Return ONLY JSON.
`;

    let profile = { emotion: "curious", goal: "", difficulty: "" };

    try {
        const response = await generateAIResponse(profilePrompt, { jsonMode: true });
        profile = typeof response === "string" ? JSON.parse(response) : response;
    } catch (error) {
        console.log("Profile detection failed, using defaults:", error);
    }

    // -------------------------
    // 3. Build Query & Find Books
    // -------------------------
    const conditions = [];

    if (profile.emotion) {
        conditions.push({ moodTags: { $regex: profile.emotion, $options: "i" } });
    }
    if (profile.goal) {
        conditions.push({ tags: { $regex: profile.goal, $options: "i" } });
    }
    if (profile.difficulty) {
        conditions.push({ difficultyLevel: { $regex: profile.difficulty, $options: "i" } });
    }

    const query = {
        availability: true,
        quantity: { $gt: 0 },
    };

    if (conditions.length > 0) {
        query.$or = conditions;
    }

    let books = await Book.find(query)
        .select("title author genre moodTags tags difficultyLevel averageRating aiSummary popularityScore")
        .sort({ popularityScore: -1, averageRating: -1 })
        .limit(20)
        .lean();

    // Fallback: If no books match the specific profile, fetch generic popular books
    if (books.length === 0) {
        books = await Book.find({ availability: true, quantity: { $gt: 0 } })
            .select("title author genre moodTags tags difficultyLevel averageRating aiSummary popularityScore")
            .sort({ popularityScore: -1, averageRating: -1 })
            .limit(20)
            .lean();
    }

    const formattedBooks = books
        .map(
            (book) => `
Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre?.join(", ") || "N/A"}
Tags: ${book.tags?.join(", ") || "N/A"}
Mood Tags: ${book.moodTags?.join(", ") || "N/A"}
Difficulty: ${book.difficultyLevel || "N/A"}
Rating: ${book.averageRating}
Summary: ${book.aiSummary || "N/A"}
`
        )
        .join("\n");

    // -------------------------
    // 4. Librarian Prompt
    // -------------------------
    const prompt = `
You are an intelligent AI Librarian.

User Emotion: ${profile.emotion}
Learning Goal: ${profile.goal}
Preferred Difficulty: ${profile.difficulty}
Borrow History: ${borrowHistory}
Favorite Genres: ${preference?.favoriteGenres?.join(", ") || "None"}
Favorite Authors: ${preference?.favoriteAuthors?.join(", ") || "None"}

Recent Chat History:
${history
    .reverse()
    .map((chat) => `${chat.role}: ${chat.message}`)
    .join("\n")}

Available Books:
${formattedBooks}

Current User Message: ${message}

Instructions:
1. Recommend ONLY books from Available Books.
2. Explain why each recommendation matches.
3. Mention author name and genre.
4. Recommend at most 3 books.
5. Use borrow history for personalization.
6. If no suitable book exists, politely say so.
7. Behave like a professional librarian.
`;

    // -------------------------
    // 5. Execution & Data Persistence
    // -------------------------
    try {
        const aiReply = await generateAIResponse(prompt);

        // Save Chat History & Updates
        await Chat.create([
            { user: userId, role: "user", message },
            { user: userId, role: "assistant", message: aiReply }
        ]);

        if (profile.emotion) {
            await UserPreference.findOneAndUpdate(
                { user: userId },
                { $addToSet: { favoriteMoods: profile.emotion } },
                { upsert: true, new: true }
            );
        }

        return res.status(200).json({
            success: true,
            profile,
            reply: aiReply,
        });

    } catch (error) {
        // Safe forwarding to your global centralized error middleware if Gemini API times out or fails
        return next(new ErrorHandler(`AI Engine Error: ${error.message}`, 500));
    }
});