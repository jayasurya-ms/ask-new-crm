import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FiArrowLeft, FiMail, FiLock, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    // Mimic API call for forget password
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset link sent to your email!");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row shadow-2xl">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:bg-transparent">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="px-0 hover:bg-transparent text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 mb-4"
              onClick={() => navigate("/")}
            >
              <FiArrowLeft /> Back to Login
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">Reset Password</h1>
            <p className="text-slate-500 text-lg">
              Enter your email address to receive a secure link to reset your password.
            </p>
          </div>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <FiLock /> Secure Reset
              </CardTitle>
              <CardDescription>
                We'll send you an email with instructions on how to get back into your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Your Email</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pink-600 transition-colors">
                      <FiMail />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-14 border-slate-200 focus:ring-pink-600"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-200 group flex items-center justify-center gap-2"
                >
                  {loading ? "Sending link..." : (
                    <>
                      Send Reset Link <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-slate-500">
            Remembered your password?{" "}
            <Link to="/" className="font-bold text-slate-900 border-b-2 border-transparent hover:border-pink-600 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Image Section (pattern like in copy) */}
      <div className="hidden lg:block lg:w-1/3 relative bg-pink-50 min-h-screen">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <img 
          src="https://images.unsplash.com/photo-1549436761-0026e6d1c863?auto=format&fit=crop&q=80&w=1200" 
          alt="Security" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white drop-shadow-lg">
          <p className="text-2xl font-black mb-2 uppercase tracking-widest text-pink-500">Security First.</p>
          <p className="text-slate-200 text-lg">We use enterprise-grade encryption to protect your community data and privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

