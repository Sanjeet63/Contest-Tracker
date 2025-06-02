import mongoose from 'mongoose';
const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    contests: [
        {
            contestId: { type: String, required: true },
            title: String,
            platform: String,
            date: Date,
            end: Date,
            duration: String,
            url: String,
        }
    ]
});

bookmarkSchema.pre('save', function(next) {
    const seen = new Set();
    this.contests = this.contests.filter(contest => {
        if (seen.has(contest.contestId)) {
            return false;
        }
        seen.add(contest.contestId);
        return true;
    });
    next();
});

export default mongoose.model('Bookmark', bookmarkSchema);
