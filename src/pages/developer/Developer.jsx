import React from "react";
import { 
  FiCode, FiTerminal, FiDatabase, FiServer, FiCpu, 
  FiShield, FiLayout, FiActivity, FiCheckCircle 
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Developer = () => {
  const stats = [
    { label: "API Status", value: "Operational", icon: FiActivity, color: "text-green-500" },
    { label: "Build Version", value: "2.4.0", icon: FiCpu, color: "text-blue-500" },
    { label: "Environment", value: "Production", icon: FiServer, color: "text-purple-500" },
    { label: "Database", value: "Connected", icon: FiDatabase, color: "text-amber-500" },
  ];

  const tools = [
    { name: "System Logs", desc: "View real-time application logs and error reports.", icon: FiTerminal },
    { name: "Permission Manager", desc: "Manage role-based access control and user levels.", icon: FiShield },
    { name: "UI Components", desc: "Browse the standardized Shadcn/Tailwind component library.", icon: FiLayout },
    { name: "Endpoint Health", desc: "Test and monitor CRM backend API endpoints.", icon: FiCheckCircle },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12 pb-20 mt-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <FiCode className="text-primary" /> Developer Dashboard
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-2xl">
          Centralized management for system health, technical documentation, and administrative developer tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md bg-white overflow-hidden transition-all hover:translate-y-[-4px]">
            <CardContent className="p-6 flex items-center gap-4 text-left">
              <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg bg-primary-gradient text-white rounded-[2rem] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
             <CardHeader className="relative z-10 px-0 pt-0">
               <CardTitle className="text-2xl font-black tracking-tight">System Status</CardTitle>
               <CardDescription className="text-white/80 font-medium">Core CRM services and external integrations monitoring.</CardDescription>
             </CardHeader>
             <CardContent className="relative z-10 px-0 space-y-4">
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="font-bold">Authentication Engine</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-black uppercase tracking-tighter">Healthy</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="font-bold">SMS Gateway (OTP)</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-black uppercase tracking-tighter">Connected</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="font-bold">Document Storage</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-black uppercase tracking-tighter">Syncing</span>
                </div>
             </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white group">
                    <CardHeader className="p-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                            <tool.icon className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-lg font-black text-slate-800">{tool.name}</CardTitle>
                        <CardDescription className="text-sm font-medium text-slate-500 leading-relaxed pt-1">
                            {tool.desc}
                        </CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Developer;
