"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Users, Shield, Mail, Phone } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen relative text-white ">

      {/* 🌄 Background */}
      <div className="fixed inset-0 -z-10">
        <Image src="/bg.jpg" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* 🔷 TOP BRAND */}
      <div className="bg-gray-900 sticky top-0 z-50 w-full flex justify-between p-4 md:px-16 gap-2 backdrop-blur-md">

        <div className="flex gap-2 items-center">
          <Image
            src="/chatnova.jpg"
            alt="ChatNova Logo"
            width={32}
            height={32}
            className="rounded-md"
          />

          <h1 className="text-lg md:text-2xl font-bold text-[#6bf4c6] ">
            ChatNova
          </h1>
        </div>
        <div className="flex gap-2 flex-nowrap">
          {/* Sign Up */}
          <Link
            href="/signup"
            className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            <Mail size={16} />
            Sign Up
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            <Phone size={16} />
            Login
          </Link>
        </div>
      </div>

      {/* 💎 HERO */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-16 pt-4 md:pt-5 gap-10">

        {/* LEFT */}
        <div className="max-w-xl text-center md:text-left">

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Chat Smarter <br />
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Connect Faster
            </span>
          </h1>

          <p className="mt-3 text-white/70 text-sm sm:text-base md:text-lg">
            Experience seamless real-time messaging with friends,
            secure conversations, and a modern chat interface.
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex w-[80%] md:w-full mx-auto md:mx-1 sm:flex-row gap-3 justify-center md:justify-start items-center">

            <Link
              href="/signup"
              className="w-full sm:w-auto text-sm sm:text-base px-5 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 font-medium shadow-md hover:scale-105 transition text-center"
            >
              Get Started
            </Link>

            {/* <Link
              href="/login"
              className="w-full sm:w-auto text-sm sm:text-base px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition text-center"
            >
              Login
            </Link> */}
          </div>

          {/* TAGS */}
          <div className="mt-5 flex gap-3 text-xs sm:text-sm text-white/60 justify-center md:justify-start">
            <span>Fast</span>
            <span>Secure</span>
            <span>Real-time</span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px]">
          <Image
            src="/illustration/chatg.jpg"
            alt="chat"
            fill
            priority
            className="object-contain rounded-md"
          />
        </div>
      </div>

      {/* ✨ FEATURES */}
      <div className="mt-14 px-4 md:px-16 pb-14">

        <h2 className="text-center text-xl md:text-2xl font-semibold mb-6">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl mx-auto">

          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-5 text-center hover:scale-105 transition">
            <MessageCircle size={28} className="mx-auto mb-2" />
            <h3 className="font-semibold text-base">Real-time Chat</h3>
            <p className="text-xs text-white/70 mt-1">
              Instant messaging with smooth experience
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-5 text-center hover:scale-105 transition">
            <Users size={28} className="mx-auto mb-2" />
            <h3 className="font-semibold text-base">Connect Easily</h3>
            <p className="text-xs text-white/70 mt-1">
              Find and connect with friends quickly
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-5 text-center hover:scale-105 transition">
            <Shield size={28} className="mx-auto mb-2" />
            <h3 className="font-semibold text-base">Secure</h3>
            <p className="text-xs text-white/70 mt-1">
              Your chats are safe and private
            </p>
          </div>

        </div>
      </div>
      {/* 🔻 FOOTER */}
      <div className="w-full text-center py-4 text-white/60 text-sm border-t border-white/10">
        © ChatNova 2026
      </div>
    </div>
  );
}