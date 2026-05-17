"use client";

import React from "react";
import {
    Users,
    FileText,
    Flag,
    Activity,
    UserX,
    Trash2,
} from "lucide-react";

const AdminHome = () => {
    return (
        <div className="space-y-6">

            {/* 🔥 STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <StatCard icon={<Users />} title="Total Users" value="1,240" />
                <StatCard icon={<FileText />} title="Posts" value="5,320" />
                <StatCard icon={<Flag />} title="Reports" value="32" />
                <StatCard icon={<Activity />} title="Active Today" value="210" />

            </div>

            {/* 🔥 QUICK ACTIONS */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">

                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

                <div className="flex flex-wrap gap-4">

                    <ActionButton icon={<UserX />} label="Ban User" />
                    <ActionButton icon={<Trash2 />} label="Delete Post" />
                    <ActionButton icon={<Flag />} label="View Reports" />

                </div>
            </div>

            {/* 🔥 RECENT ACTIVITY */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">

                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

                <div className="space-y-3">

                    <ActivityItem text="User Rahul banned" />
                    <ActivityItem text="Post removed due to violation" />
                    <ActivityItem text="New report submitted" />

                </div>
            </div>

        </div>
    );
};

export default AdminHome;



// 🔥 STAT CARD
const StatCard = ({ icon, title, value }) => {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition">

            <div className="p-3 bg-white/20 rounded-xl">
                {icon}
            </div>

            <div>
                <p className="text-sm text-white/70">{title}</p>
                <h3 className="text-xl font-bold">{value}</h3>
            </div>

        </div>
    );
};



// 🔥 ACTION BUTTON
const ActionButton = ({ icon, label }) => {
    return (
        <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition">
            {icon}
            <span>{label}</span>
        </button>
    );
};



// 🔥 ACTIVITY ITEM
const ActivityItem = ({ text }) => {
    return (
        <div className="p-3 bg-white/10 rounded-xl text-sm text-white/80">
            {text}
        </div>
    );
};