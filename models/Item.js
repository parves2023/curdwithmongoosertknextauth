import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
}, {
  timestamps: true
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
