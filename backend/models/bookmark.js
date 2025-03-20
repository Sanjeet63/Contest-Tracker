import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  contestId: { type: String, required: true },
  name: { type: String },
  url: { type: String },
  date: { type: String },
  platform: { type: String }
});

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

export default Bookmark;
