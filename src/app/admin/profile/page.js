"use client";

import React from "react";
import {
    Edit,
    LogOut,
    Users,
    FileText,
    Flag,
} from "lucide-react";

const Profile = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-4 md:p-8">

            {/* 🔥 PROFILE CARD */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8">

                {/* 🔝 HEADER */}
                <div className="flex flex-col md:flex-row items-center gap-6">

                    {/* AVATAR */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
                        A
                    </div>

                    {/* INFO */}
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold">Admin User</h2>
                        <p className="text-white/70 text-sm mt-1">
                            Managing platform activities & moderation
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition">
                            <Edit size={16} />
                            Edit
                        </button>

                        <button className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* 🔥 STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                    <StatCard icon={<Users />} label="Users Managed" value="1,240" />
                    <StatCard icon={<FileText />} label="Posts Reviewed" value="5,320" />
                    <StatCard icon={<Flag />} label="Reports Handled" value="320" />

                </div>

                {/* 🔥 DETAILS */}
                <div className="mt-8 space-y-4">

                    <InfoRow label="Email" value="admin@chatnova.com" />
                    <InfoRow label="Role" value="Super Admin" />
                    <InfoRow label="Joined" value="Jan 2026" />

                </div>

            </div>
        </div>
    );
};

export default Profile;



/* 🔥 STAT CARD */
const StatCard = ({ icon, label, value }) => {
    return (
        <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center gap-3">

            <div className="p-2 bg-white/20 rounded">{icon}</div>

            <div>
                <p className="text-sm text-white/70">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
};



/* 🔥 INFO ROW */
const InfoRow = ({ label, value }) => {
    return (
        <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
            <span className="text-white/60">{label}</span>
            <span>{value}</span>
        </div>
    );
};