"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // ✅ VALIDATION
    const validate = () => {
        let newErrors = {};

        if (!form.username) newErrors.username = "Username required";
        if (!form.email) newErrors.email = "Email required";
        if (!form.password) newErrors.password = "Password required";

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix errors");
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

        try {
            await API.post("/auth/signup", form);

            toast.success("Signup successful 🎉");
            router.push("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">

            {/* BG */}
            <div className="absolute inset-0 -z-10">
                <Image src="/bg.jpg" alt="bg" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="w-full max-w-5xl p-5 grid md:grid-cols-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
                {/* LEFT */}
                <div className="hidden md:flex flex-col items-center justify-center p-10 text-white">

                    <div className="relative w-64 h-64">
                        <Image
                            src="/illustration/signup.svg"
                            alt="Signup"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>

                    <h2 className="text-3xl font-bold mt-4">
                        Join Us 🚀
                    </h2>

                    <p className="text-white/70 text-center mt-2">
                        Create your account and start your journey today.
                    </p>
                </div>
                {/* RIGHT */}
                <div className="p-8 text-white w-full">

                    <h2 className="text-2xl font-bold text-center mb-6">
                        Create Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* USERNAME */}
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-white/60" size={16} />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full pl-9 p-3 rounded-lg bg-white/20 border border-white/30"
                                onChange={(e) =>
                                    setForm({ ...form, username: e.target.value })
                                }
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-white/60" size={16} />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full pl-9 p-3 rounded-lg bg-white/20 border border-white/30"
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-white/60" size={16} />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-9 pr-10 p-3 rounded-lg bg-white/20 border border-white/30"
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                            <div
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-3 cursor-pointer"
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-white/60" size={16} />
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="w-full pl-9 pr-10 p-3 rounded-lg bg-white/20 border border-white/30"
                                onChange={(e) =>
                                    setForm({ ...form, confirmPassword: e.target.value })
                                }
                            />
                            <div
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-3 cursor-pointer"
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                        </div>

                        {/* ERROR */}
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm text-center">
                                {errors.confirmPassword}
                            </p>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black p-3 rounded-lg cursor-pointer"
                        >
                            {loading ? "Creating..." : "Signup"}
                        </button>
                    </form>

                    <p className="text-center mt-4">
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