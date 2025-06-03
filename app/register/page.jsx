"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [form, setForm] = useState({ email: "", password: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 300;
        canvas.height = 300;
        ctx.drawImage(img, 0, 0, 300, 300);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  setUploading(true);
  try {
    const resizedBlob = await resizeImage(file);

    const formData = new FormData();
    formData.append("file", resizedBlob);
    formData.append("upload_preset", "cloudinaryPractice");
    formData.append("folder", "parves/practice");

    const res = await fetch(`https://api.cloudinary.com/v1_1/dhxyjdrvr/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      setForm((prev) => ({ ...prev, image: data.secure_url }));
      Swal.fire("Image Uploaded!", "Your profile picture was uploaded.", "success");
    } else {
      throw new Error("Image upload failed");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", "Image upload failed", "error");
  } finally {
    setUploading(false);
  }
};


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success!", "Account created successfully", "success");
        router.push("/login");
      } else {
        Swal.fire("Error!", data.message || "Registration failed", "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 w-full"
        />
        {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
        {form.image && (
          <img
            src={form.image.replace("/upload/", "/upload/w_200,h_200,c_fill/")}
            alt="Uploaded"
            className="w-20 h-20 rounded-full object-cover mt-2"
          />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
