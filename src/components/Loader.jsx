"use client";

export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/40 backdrop-blur-md">

            <div className="flex flex-col items-center gap-4">

                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-white/30 
          border-t-blue-500 rounded-full animate-spin"></div>

                {/* Text */}
                <p className="text-white text-sm tracking-wide">
                    Loading...
                </p>

            </div>
        </div>
    );
}