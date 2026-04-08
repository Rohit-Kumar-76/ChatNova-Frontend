"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // 🔍 VALIDATION
    const validate = () => {
        let newErrors = {};

        // USERNAME RULE (🔥 Instagram style)
        const usernameRegex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

        if (!form.username) {
            newErrors.username = "Username is required";
        } else if (!usernameRegex.test(form.username)) {
            newErrors.username =
                "3-20 chars, letters/numbers/._ only, no space, no start/end with . or _";
        }

        // EMAIL
        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        // PASSWORD
        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Minimum 6 characters required";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await API.post("/auth/signup", form);

            alert("Signup successful 🎉");
            router.push("/login");
        } catch (err) {
            const message = err.response?.data?.message;

            // 🔥 BACKEND ERROR HANDLE
            if (message?.toLowerCase().includes("email")) {
                setErrors({ email: "Email already exists" });
            } else if (message?.toLowerCase().includes("username")) {
                setErrors({ username: "Username already taken" });
            } else {
                setErrors({ general: message || "Something went wrong" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">

            {/* 🌄 BG */}
            <div className="absolute inset-0 -z-10">
                <Image src="/bg.jpg" alt="bg" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* 💎 CARD */}
            <div className="w-full max-w-5xl p-5 grid md:grid-cols-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">

                {/* LEFT */}
                <div className="hidden md:flex flex-col items-center justify-center p-10 text-white">
                    <div className="relative w-64 h-64">
                        <Image
                            src="/illustration/signup.svg"
                            alt="Signup"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h2 className="text-3xl font-bold mt-4">Join Us 🚀</h2>
                    <p className="text-white/80 text-center mt-2">
                        Create your account and start your journey today.
                    </p>
                </div>

                {/* RIGHT */}
                <div className="p-8 text-white">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Create Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* USERNAME */}
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                className={`w-full p-3 rounded-lg bg-white/20 border 
                ${errors.username ? "border-red-500" : "border-white/30"} 
                focus:outline-none`}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setForm({ ...form, username: value });

                                    if (errors.username) {
                                        setErrors({ ...errors, username: "" });
                                    }
                                }}
                            />
                            {errors.username && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full p-3 rounded-lg bg-white/20 border 
                ${errors.email ? "border-red-500" : "border-white/30"}`}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className={`w-full p-3 rounded-lg bg-white/20 border 
                ${errors.password ? "border-red-500" : "border-white/30"}`}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* GENERAL ERROR */}
                        {errors.general && (
                            <p className="text-red-400 text-sm text-center">
                                {errors.general}
                            </p>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-semibold p-3 rounded-lg hover:bg-gray-200 transition"
                        >
                            {loading ? "Creating account..." : "Signup"}
                        </button>
                    </form>

                    {/* LOGIN */}
                    <p className="text-sm text-center mt-4 text-white/80">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}