import { Chat } from "../Models/ChatModel.js";
import { Book } from "../Models/BookModel.js";
import { UserPreference } from "../Models/UserPreferenceModel.js";
import { generateAIResponse } from "../services/aiService.js";
import { catchAsynError } from "../middlewear/CatchAsyncErrors.js";

export const chatWithAI = catchAsynError(
    async (req, res, next) => {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const userId = req.user._id;
        await Chat.create({
            user: userId,
            role: "user",
            message,
        });
        const history = await Chat.find({
            user: userId,
        })
            .sort({ createdAt: -1 })
            .limit(10);
        const preference = await UserPreference.findOne({
            user: userId,
        });

        const moodPrompt = `
Analyze the user's message and return ONLY ONE of the following moods.

Allowed Moods:
Happy
Sad
Motivated
Stressed
Relaxed
Curious

User Message:
"${message}"

Return ONLY the mood.
`;

        let mood = "Curious";

        try {
            mood = (
                await generateAIResponse(moodPrompt)
            )
                .trim()
                .replace(/["']/g, "");
        } catch (error) {
            console.log("Mood detection failed:", error);
        }

        // -------------------------
        // Mood Based Books
        // -------------------------

        let moodBooks = await Book.find({
            moodTags: {
                $regex: mood,
                $options: "i",
            },
        })
            .select(
                "title author genre moodTags averageRating aiSummary"
            )
            .limit(20);

        // Fallback if no mood books found
        if (moodBooks.length === 0) {
            moodBooks = await Book.find({})
                .select(
                    "title author genre moodTags averageRating aiSummary"
                )
                .limit(20);
        }

        // -------------------------
        // AI Prompt
        // -------------------------

        const prompt = `
You are an intelligent AI Librarian.

User Mood:
${mood}

User Preferences:
${JSON.stringify(preference || {})}

Recent Chat History:
${history
                .reverse()
                .map(
                    (chat) =>
                        `${chat.role}: ${chat.message}`
                )
                .join("\n")}

Available Books:
${JSON.stringify(moodBooks)}

Current User Message:
${message}

Instructions:

1. Recommend ONLY books from Available Books.
2. Use user's mood while recommending.
3. Use previous chat history for personalization.
4. Explain WHY each recommendation matches.
5. Mention author name.
6. Mention genre if available.
7. Recommend at most 3 books.
8. If no suitable book exists, politely say so.
9. Respond naturally like a librarian.
`;

        const aiReply = await generateAIResponse(prompt);

        // Save AI response
        await Chat.create({
            user: userId,
            role: "assistant",
            message: aiReply,
        });

        // -------------------------
        // Learn User Preferences
        // -------------------------

        await UserPreference.findOneAndUpdate(
            {
                user: userId,
            },
            {
                $addToSet: {
                    favoriteMoods: mood,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );

        return res.status(200).json({
            success: true,
            mood,
            reply: aiReply,
        });
    }
);