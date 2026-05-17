"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Users,
    FileText,
    Flag,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">

            {/* 🔥 MOBILE SIDEBAR */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                >
                    <div
                        className="w-64 h-full bg-black p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* 🔥 DESKTOP SIDEBAR */}
            <div className="hidden md:block w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 p-5">
                <Sidebar />
            </div>

            {/* 🔥 MAIN */}
            <div className="flex-1 flex flex-col">

                {/* 🔝 TOPBAR */}
                <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5 backdrop-blur-xl">

                    {/* MOBILE MENU */}
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(true)}
                    >
                        <Menu />
                    </button>

                    <h1 className="text-lg font-semibold">Admin Dashboard</h1>

                    <Link href="/admin/profile">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold cursor-pointer">
                            A
                        </div>
                    </Link>
                </div>

                {/* 🔥 CONTENT (IMPORTANT FIX) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}



/* 🔥 SIDEBAR */
const Sidebar = () => {
    return (
        <div className="h-full flex flex-col justify-between">

            {/* TOP */}
            <div>
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

                <nav className="space-y-2">

                    <SidebarItem
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        href="/admin"
                    />

                    <SidebarItem
                        icon={<Users size={18} />}
                        label="Users"
                        href="/admin/users"
                    />

                    <SidebarItem
                        icon={<FileText size={18} />}
                        label="Posts"
                        href="/admin/posts"
                    />

                    <SidebarItem
                        icon={<Flag size={18} />}
                        label="Reports"
                        href="/admin/reports"
                    />

                    <SidebarItem
                        icon={<Settings size={18} />}
                        label="Settings"
                        href="/admin/settings"
                    />

                </nav>
            </div>

            {/* 🔥 LOGOUT */}
            <button className="flex items-center gap-2 text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition">
                <LogOut size={18} />
                Logout
            </button>

        </div>
    );
};



/* 🔥 SIDEBAR ITEM */
const SidebarItem = ({ icon, label, href }) => {
    return (
        <Link href={href}>
            <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/20 transition">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
        </Link>
    );
};