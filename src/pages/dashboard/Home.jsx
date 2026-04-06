import React from "react";
import { Link } from "react-router-dom";
import { 
  FiUsers, FiUserCheck, FiUserPlus, FiDownload, FiSettings, FiBriefcase, FiArrowLeft 
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dashboardMetrics = [
  { 
    title: "Life Time Members", 
    description: "View and manage active lifetime silver/gold members.", 
    icon: FiUserCheck, 
    link: "/life-time-member", 
    color: "bg-blue-500",
    stats: "Active" 
  },
  { 
    title: "Patron Members", 
    description: "Manage elite patron members and their contributions.", 
    icon: FiBriefcase, 
    link: "/patron-member", 
    color: "bg-pink-600",
    stats: "Managed" 
  },
  { 
    title: "New Registrations", 
    description: "Review pending registrations and assign MIDs.", 
    icon: FiUserPlus, 
    link: "/new-register", 
    color: "bg-indigo-600",
    stats: "Pending" 
  },
  { 
    title: "Family Members", 
    description: "Track and update dependent family associations.", 
    icon: FiUsers, 
    link: "/family-member", 
    color: "bg-slate-800",
    stats: "Unified" 
  }
];

const Home = () => {
  const userName = localStorage.getItem("name") || "Member";

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12 pb-20 mt-6 animate-in fade-in duration-700">
      <div className="relative overflow-hidden bg-primary-gradient text-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-pink-100">

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Welcome to Agarwal Samaj <span className="text-white/80">CRM Portal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
                Hello, {userName}. Efficiently manage memberships, track registrations, and handle community communications from your unified dashboard.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/profile">
                    <Button className="bg-white text-primary hover:bg-slate-50 rounded-2xl h-14 px-8 font-black text-lg transition-transform active:scale-95 shadow-xl">
                        Update My Profile
                    </Button>
                </Link>

                <Link to="/download">
                    <Button variant="outline" className="text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl h-14 px-8 font-bold text-lg">
                        <FiDownload className="mr-2" /> Download Reports
                    </Button>
                </Link>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {dashboardMetrics.map((metric, i) => (
            <Link key={i} to={metric.link} className="group">
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
                    <div className={`${metric.color} h-2 w-full`} />
                    <CardHeader className="pt-8 px-8">
                        <div className={`w-14 h-14 ${metric.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <metric.icon className="w-6 h-6" />
                        </div>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">{metric.title}</CardTitle>
                        </div>
                        <CardDescription className="pt-2 text-slate-500 font-medium leading-relaxed">
                            {metric.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">{metric.stats} Module</span>
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                            <FiArrowLeft className="rotate-180" />
                        </div>

                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900">Need Community Assistance?</h3>
              <p className="text-slate-500 font-medium max-w-lg">If you encounter issues while managing the CRM, please refer to the technical documentation or contact the Samaj administrator.</p>
          </div>
          <Button variant="outline" className="h-14 px-10 rounded-2xl border-slate-200 font-bold flex items-center gap-2">
              <FiSettings /> Contact Support
          </Button>
      </div>
    </div>
  );
};

export default Home;

