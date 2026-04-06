import React from "react";
import { Hammer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-primary mb-8 border-4 border-pink-200">
                <Hammer className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Under Maintenance</h1>
            <p className="text-slate-500 text-lg max-w-md mb-8">
                The Agarwal Samaj CRM panel is currently undergoing scheduled maintenance to improve your experience. We'll be back online shortly.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button 
                    className="bg-primary hover:bg-primary/90 text-white h-12 rounded-xl shadow-lg shadow-pink-100"
                    onClick={() => navigate("/")}
                >
                    Try Refreshing
                </Button>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking system status...
                </div>
            </div>
        </div>
    );
};

export default Maintenance;

