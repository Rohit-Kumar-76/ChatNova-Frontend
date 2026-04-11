"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";


export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    // ✅ Validation


    const validate = () => {
        let newErrors = {};

        if (!form.email) {
            newErrors.email = "Email is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        // 🔥 toast for validation
        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fill all fields");
        }

        return Object.keys(newErrors).length === 0;
    };

    // ✅ Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const { data } = await API.post("/auth/login", form);

            login(data);

            toast.success("Login successful 🎉");
            localStorage.setItem("user", JSON.stringify(data));

            router.push("/home");


        } catch (err) {
            const msg =
                err.response?.data?.message || "Invalid credentials";

            setErrors({ api: msg });

            // 🔥 ERROR TOAST
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center">

            {/* 🌄 Background */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg2.jpg"
                    alt="background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
            </div>

            {/* 💎 Glass Container */}
            <div className="w-[90%] mx-auto max-w-5xl grid md:grid-cols-2 
                backdrop-blur-2xl bg-white/10 
                border border-white/20 
                rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                overflow-hidden">

                {/* LEFT SIDE */}
                <div className="hidden md:flex flex-col items-center justify-center p-10 text-white">

                    <div className="relative w-64 h-64">
                        <Image
                            src="/illustration/login.svg"
                            alt="Login Illustration"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>

                    <h2 className="text-3xl font-bold mt-4">
                        Welcome Back 👋
                    </h2>

                    <p className="text-white/70 text-center mt-2">
                        Login to access your dashboard and continue your journey.
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="p-10 mx-auto w-[90%] flex flex-col justify-center text-white">

                    <h2 className="text-2xl font-bold text-center mb-6">
                        Login
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-4 text-white/60" size={16} />
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full pl-9 p-3 rounded-xl 
        bg-white/15 border 
        ${errors.email ? "border-red-500" : "border-white/30"} 
        placeholder-white/60 
        focus:outline-none focus:ring-2 
        ${errors.email ? "focus:ring-red-500" : "focus:ring-white/80"} 
        backdrop-blur-md transition`}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    setErrors({ ...errors, email: "", api: "" });
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-4 text-white/60" size={16} />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                className={`w-full pl-9 pr-10 p-3 rounded-xl 
        bg-white/15 border 
        ${errors.password ? "border-red-500" : "border-white/30"} 
        placeholder-white/60 
        focus:outline-none focus:ring-2 
        ${errors.password ? "focus:ring-red-500" : "focus:ring-white/80"} 
        backdrop-blur-md transition`}
                                onChange={(e) => {
                                    setForm({ ...form, password: e.target.value });
                                    setErrors({ ...errors, password: "", api: "" });
                                }}
                            />

                            {/* 👁 Toggle */}
                            <div
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-3 cursor-pointer text-white/70"
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full bg-white/90 text-black font-semibold p-3 rounded-xl 
                            hover:bg-white transition shadow-lg"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        {/* API Error (optional UI) */}
                        {errors.api && (
                            <p className="text-red-400 text-sm text-center">
                                {errors.api}
                            </p>
                        )}
                    </form>

                    {/* Redirect */}
                    <p className="text-sm text-center mt-4 text-white/70">
                        Don’t have an account?{" "}
                        <Link href="/signup" className="underline hover:text-white">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}