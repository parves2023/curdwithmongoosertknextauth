import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetTokenExpire: { type: Date, default: null },
}, { timestamps: true });

// Force refresh model in dev (Next.js hot reload)
delete mongoose.connection.models['User'];
const User = mongoose.model("User", userSchema);

export default User;
