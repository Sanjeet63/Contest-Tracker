import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchPastContests, fetchUpcomingContests } from './contestController.js';
import Bookmark from '../models/bookmark.js';
import Chat from '../models/chat.js';
import User from '../models/user.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChatbotQuery = async (req, res) => {
    try {
        const { query, userId } = req.body;
        if (!query) return res.status(400).json({ error: 'Query is required' });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Fetch user context
        let userContext = '';
        if (userId) {
            const user = await User.findOne({ uid: userId });
            const bookmarks = await Bookmark.find({ userId });
            userContext = `User details: Name: ${user?.displayName || 'User'}, Email: ${user?.email || 'N/A'}, Bookmarks: ${bookmarks.map(b => b.contestName).join(', ') || 'None'}, AI Project: ${user?.aiProjectLink || 'None'}. `;
        }

        const intentPrompt = `
Classify the user query into one of these intents:
past_contests, upcoming_contests, suggestions, submit_ai_project, contest_info, practice_advice, strategy, problem_help
Respond with only the intent.
`;
        const intentResult = await model.generateContent([intentPrompt, query]);
        const intent = intentResult.response.text().trim().toLowerCase();

        let context = userContext;
        let data = {};

        if (intent === 'past_contests') {
            data.pastContests = await fetchPastContests();
            context = 'Here are the past contests: ' + JSON.stringify(data.pastContests);
        } else if (intent === 'upcoming_contests') {
            data.upcomingContests = await fetchUpcomingContests();
            context = 'Here are the upcoming contests: ' + JSON.stringify(data.upcomingContests);
        } else if (intent === 'suggestions') {
            if (userId) {
                const bookmarks = await Bookmark.find({ userId });
                data.bookmarks = bookmarks;
                context = 'Based on your bookmarks: ' + JSON.stringify(bookmarks) + ', here are suggestions.';
            } else {
                context = 'Please log in for personalized suggestions.';
            }
        } else if (intent === 'contest_info') {
            context = 'Summarize contest difficulty, problem topics, and feedback.';
        } else if (intent === 'practice_advice') {
            context = 'Suggest contests/problems for the topic mentioned in the query, include available editorials.';
        } else if (intent === 'strategy') {
            context = 'Provide step-by-step strategy or learning resources.';
        } else if (intent === 'problem_help') {
            context = 'Explain the problem concept and suggest similar practice problems.';
        } else if (intent === 'submit_ai_project') {
            if (userId) {
                const extractPrompt = 'Extract the URL or link from the following message. If no URL, respond with "none". Respond with only the URL.';
                const extractResult = await model.generateContent([extractPrompt, query]);
                const link = extractResult.response.text().trim();
                if (link && link !== 'none') {
                    await User.findOneAndUpdate({ uid: userId }, { aiProjectLink: link });
                    context = 'Your AI project link has been saved. Thanks for sharing your work!';
                } else {
                    context = 'Please provide a valid link to your AI project.';
                }
            } else {
                context = 'Please log in to submit your AI project link.';
            }
        } else {
            context = 'I can help with past contests, upcoming contests, suggestions, contest info, practice advice, strategy, problem explanations, or submitting your AI project link.';
        }

        const responsePrompt = `
You are Contest AI Assistant for CP Hub, a friendly guide for competitive programming.
${userContext ? `User Context: ${userContext}` : ''}
- Always answer in plain, clear text in 2-4 sentences.
- Never return JSON, markdown, or asterisks.
- Give actionable advice, tips, or resources whenever possible.
- If user asks "how was a contest", summarize difficulty, common problem topics, and feedback.
- If user asks "which contest for DP practice", suggest contests with DP problems and available editorials.
- If user asks strategy questions, provide step-by-step guidance or learning resources.
- If user asks about problem types, explain concepts and point to similar problems for practice.
- If user asks about upcoming contests, provide dates, platforms, and level of difficulty.
- Always keep tone simple, encouraging, and student-friendly.
- Reference user context when relevant to make conversations relatable.
`;

        const responseResult = await model.generateContent([responsePrompt, query, context]);
        const reply = responseResult.response.text() || "I'm here to guide you with competitive programming contests.";

        const chat = new Chat({ userId: userId || 'anonymous', userMessage: query, botResponse: reply });
        await chat.save();

        res.json({ reply, intent, data });

    } catch (error) {
        console.error('Error in chatbotQuery:', error);
        res.status(500).json({ error: 'Failed to process query' });
    }
};

export const handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

        // Fetch user context
        let userContext = '';
        if (userId) {
            const user = await User.findOne({ uid: userId });
            const bookmarks = await Bookmark.find({ userId });
            userContext = `User details: Name: ${user?.displayName || 'User'}, Email: ${user?.email || 'N/A'}, Bookmarks: ${bookmarks.map(b => b.contestName).join(', ') || 'None'}, AI Project: ${user?.aiProjectLink || 'None'}. `;
        }

        const systemPrompt = `
You are a helpful contest guide assistant for competitive programming students.
${userContext ? `User Context: ${userContext}` : ''}
- Always reply in simple plain text (no bold, no lists, no markdown).
- Use short and clear sentences (2–4 lines).
- Keep a friendly, informative, and professional tone.
- Help with questions about past and upcoming contests, preparation tips, and strategies.
- Encourage learning and practice.
- Reference user context when relevant to make conversations relatable.
`;

        const result = await model.generateContent([systemPrompt, message]);
        const botResponse = result.response.text() || "I'm here to guide you with contests.";

        const chat = new Chat({ userId: userId || 'anonymous', userMessage: message, botResponse });
        await chat.save();

        res.json({ botResponse });
    } catch (error) {
        console.error('Error in handleChat:', error);
        res.status(500).json({ error: "Something went wrong!" });
    }
};
