import { hash } from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    console.log("Received token:", token);
    console.log("Received newPassword:", password);

    if (!token || !password) {
      return Response.json({ message: "Token and password required." }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    console.log("Found user:", user);

    if (!user) {
      return Response.json({ message: "Invalid or expired token." }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    return Response.json({ message: "Password reset successful." }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ message: "Internal server error." }, { status: 500 });
  }
}
