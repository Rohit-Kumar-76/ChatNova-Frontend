"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";


export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    // ✅ Validation

    const [resetData, setResetData] = useState({
        email: "",
        otp: "",
        password: "",
        confpassword: "",
    });

    const [sendingOtp, setSendingOtp] = useState(false);
    const [verified, setVerified] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // =========================
    // SEND OTP
    // =========================
    const handleSendOTP = async () => {

        if (!resetData.email) {
            return toast.error("Please enter email");
        }

        try {

            setSendingOtp(true);

            await API.post("/auth/forgot-password", {
                email: resetData.email,
            });

            toast.success("OTP sent successfully");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to send OTP"
            );

        } finally {

            setSendingOtp(false);
        }
    };

    // =========================
    // VERIFY OTP
    // =========================
    const handleVerifyOTP = async () => {

        if (!resetData.email || !resetData.otp) {
            return toast.error("Enter email and OTP");
        }

        try {

            await API.post("/auth/verify-otp", {
                email: resetData.email,
                otp: resetData.otp,
            });

            setVerified(true);

            toast.success("OTP verified");

        } catch (error) {

            setVerified(false);

            toast.error(
                error.response?.data?.message ||
                "Invalid OTP"
            );
        }
    };

    // =========================
    // RESET PASSWORD
    // =========================
    const handleResetPassword = async (e) => {

        e.preventDefault();

        if (!verified) {
            return toast.error("Please verify OTP");
        }

        if (
            !resetData.password ||
            !resetData.confpassword
        ) {
            return toast.error("Enter all fields");
        }

        if (
            resetData.password !==
            resetData.confpassword
        ) {
            return toast.error("Passwords do not match");
        }

        try {

            setChangingPassword(true);

            await API.post("/auth/reset-password", {
                email: resetData.email,
                otp: resetData.otp,
                password: resetData.password,
            });

            toast.success("Password changed successfully");

            setOpen(false);

            setResetData({
                email: "",
                otp: "",
                password: "",
                confpassword: "",
            });

            setVerified(false);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to reset password"
            );

        } finally {

            setChangingPassword(false);
        }
    };

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



            {/* //loading  */}
            {loading && <Loader />}

            {/* 🌄 Background */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg2.jpg"
                    alt="background"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                    <div className=" flex mt-4 items-center justify-center gap-4">
                        <p className="text-sm   text-white/70">
                            Don’t have an account?{" "}
                            <Link href="/signup" className="underline hover:text-white">
                                Sign up
                            </Link>

                        </p>/
                        <button onClick={() => setOpen(true)} className="cursor-pointer text-blue-500 underline inline-block">
                            Forget Password
                        </button>
                    </div>


                </div>
            </div >

            {
                open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                        <div className="w-[90%] max-w-md rounded-2xl bg-gray-900 border border-white/10 p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">

                            {/* HEADER */}
                            <div className="text-center">

                                <h2 className="text-2xl font-bold">
                                    Reset Password
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    Enter your email, OTP and new password
                                </p>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleResetPassword}
                                className="mt-6 flex flex-col gap-4"
                            >

                                {/* EMAIL */}
                                <div>

                                    <div className="flex justify-between items-center">

                                        <label className="text-sm text-gray-300">
                                            Email
                                        </label>

                                        <button
                                            type="button"
                                            disabled={sendingOtp}
                                            onClick={handleSendOTP}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
                                        >
                                            {sendingOtp
                                                ? "Sending..."
                                                : "Send OTP"}
                                        </button>
                                    </div>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={resetData.email}
                                        disabled={verified}
                                        onChange={(e) =>
                                            setResetData({
                                                ...resetData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* OTP */}
                                <div>

                                    <div className="flex justify-between items-center">

                                        <label className="text-sm text-gray-300">
                                            OTP
                                        </label>

                                        {!verified ? (
                                            <button
                                                type="button"
                                                onClick={handleVerifyOTP}
                                                className="text-xs text-blue-400 hover:text-blue-300 transition"
                                            >
                                                Verify
                                            </button>
                                        ) : (
                                            <span className="text-xs text-green-400">
                                                Verified ✓
                                            </span>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="_ _ _ _ _ _ _"
                                        value={resetData.otp}
                                        onChange={(e) =>
                                            setResetData({
                                                ...resetData,
                                                otp: e.target.value,
                                            })
                                        }
                                        className={`
                            w-full mt-1 rounded-xl border p-3 px-8 outline-none tracking-[30px] text-2xl 

                            ${verified
                                                ? "border-green-500 bg-green-500/10"
                                                : "border-white/10 bg-white/5 focus:border-blue-500"
                                            }
                            `}
                                    />
                                </div>

                                {/* NEW PASSWORD */}
                                <div>

                                    <label className="text-sm text-gray-300">
                                        New Password
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter new password"
                                        value={resetData.password}
                                        onChange={(e) =>
                                            setResetData({
                                                ...resetData,
                                                password: e.target.value,
                                            })
                                        }
                                        className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div>

                                    <label className="text-sm text-gray-300">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        value={resetData.confpassword}
                                        onChange={(e) =>
                                            setResetData({
                                                ...resetData,
                                                confpassword: e.target.value,
                                            })
                                        }
                                        className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-3 mt-2">

                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 rounded-xl bg-white/10 p-3 hover:bg-white/20 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={changingPassword}
                                        className="flex-1 rounded-xl bg-blue-500 p-3 font-medium hover:bg-blue-600 transition disabled:opacity-50"
                                    >
                                        {changingPassword
                                            ? "Updating..."
                                            : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}