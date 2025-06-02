import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    contestId: { type: String, required: true },
    contestTitle: { type: String, required: true },
    email: { type: String, required: true },
    minutesBefore: { type: Number, required: true },
    contestStartTime: { type: Date, required: true },
    sent: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);

export default Reminder;
