'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthButton from "../../components/AuthButton";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: true,
      callbackUrl: "/",
    });

    if (res?.error) {
      alert("Login failed: " + res.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <div>
          forgot password?{" "}
          <a href="/forgotpassword" className="text-blue-600 hover:underline">
            Click here  
          </a>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
      <div className="mt-4">
        Or sign in with{" "}
        <AuthButton />
      </div>
    </div>
  );
}
