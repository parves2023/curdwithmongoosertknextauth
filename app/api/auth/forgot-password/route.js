import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email } = await req.json();
  await connectToDB();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), {
      status: 404,
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpire = Date.now() + 3600000; // 1 hour

  user.resetToken = resetToken;
  user.resetTokenExpire = resetTokenExpire;
  await user.save();


  console.log("Saved user:", user); // should show updated token fields

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  // Send email using Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>You requested a password reset</p>
           <p><a href="${resetUrl}">Click here to reset your password</a></p>`,
  });

  return new Response(JSON.stringify({ message: 'Reset link sent to email' }), {
    status: 200,
  });
}
