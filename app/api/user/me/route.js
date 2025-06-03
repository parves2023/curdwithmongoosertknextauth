// pages/api/user/me.js or app/api/user/me/route.js (for app dir)
import { connectToDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return new Response("Missing email", { status: 400 });

  await connectToDB();
  const user = await User.findOne({ email }).select("-password");
  if (!user) return new Response("User not found", { status: 404 });

  return new Response(JSON.stringify(user), { status: 200 });
}


// http://localhost:3000/api/user/me?email=new@asdf.com
// Example response for the above request
// {"_id":"683f4ce015d125d0a68416fc","image":"https://res.cloudinary.com/dhxyjdrvr/image/upload/v1748978801/parves/practice/20250604_001746_occznf.jpg","email":"new@asdf.com","resetToken":null,"resetTokenExpire":null,"createdAt":"2025-06-03T19:28:32.181Z","updatedAt":"2025-06-03T19:28:32.181Z","__v":0}
