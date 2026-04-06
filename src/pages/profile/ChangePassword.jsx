import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiLock, FiEye, FiEyeOff, FiSave, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setLoading(true);
    try {
      // Logic from src copy was just a placeholder UI
      // But we can implement a real logic if endpoint exists
      // For now, mirroring the src copy's lack of action but with better UI
      const response = await apiClient.post("/web-change-password", {
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      if (response.data.code === 200) {
        toast.success("Password changed successfully");
        navigate("/home");
      } else {
        toast.error(response.data.msg || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Link might not exist yet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-center h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-primary-gradient text-white p-8">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FiLock /> Change Password
          </CardTitle>
          <CardDescription className="text-pink-100">
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form id="changePassword" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="old_password">Old Password</Label>
              <div className="relative group">
                <Input
                  id="old_password"
                  name="old_password"
                  type={showPasswords.old ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.old_password}
                  onChange={onInputChange}
                  required
                  className="h-12 pr-10 border-slate-200 focus:ring-pink-600 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative group">
                <Input
                  id="new_password"
                  name="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.new_password}
                  onChange={onInputChange}
                  required
                  className="h-12 pr-10 border-slate-200 focus:ring-pink-600 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <p className="text-xs text-slate-400">Password should be at least 8 characters long.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <div className="relative group">
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={onInputChange}
                  required
                  className="h-12 pr-10 border-slate-200 focus:ring-pink-600 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0 flex flex-col gap-4">
          <Button
            form="changePassword"
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Changing Password...
              </>
            ) : (
                <>
                    <FiSave /> Reset Password
                </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-900"
          >
            <FiArrowLeft /> Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;

