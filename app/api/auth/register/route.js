import { hash } from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password, image } = await req.json(); // Accept image field
    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      image: image || "", // Save image or an empty string
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
