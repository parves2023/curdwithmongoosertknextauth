import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  image: String,
  provider: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  resetToken: { type: String, default: null },
  resetTokenExpire: { type: Date, default: null },
}, { timestamps: true });

// Force refresh model in dev (Next.js hot reload)
delete mongoose.connection.models['User'];
const User = mongoose.model("User", userSchema);

export default User;
