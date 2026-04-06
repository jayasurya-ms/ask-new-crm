import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FiKey, FiSave, FiArrowLeft, FiUser, FiInfo } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const NewMidAssign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const [newMidRef, setNewMidRef] = useState(null);
  const [formData, setFormData] = useState({
    user_mid: "",
    amount_num: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(WEB_API.fetchMemberData(id));
        setMemberData(response.data.member_data);
        setNewMidRef(response.data.new_mid);
        // Pre-fill if needed
      } catch (error) {
        console.error("Error fetching member data for MID assign:", error);
        toast.error("Failed to load registration data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = {
      user_mid: formData.user_mid,
      mtype: memberData?.member_type,
      amount_num: formData.amount_num,
    };

    try {
      const res = await apiClient.put(WEB_API.updateMid(id), data);
      if (res.data.code === 200 || res.data.code === "200") {
        toast.success("MID Assigned Successfully");
        navigate("/new-register");
      } else {
        toast.error(res.data.msg || "Assignment failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during MID assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-10rem)] mt-6">
      <Card className="w-full max-w-2xl border-none shadow-xl bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="bg-primary-gradient text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FiKey /> Assign New MID
              </CardTitle>
              <CardDescription className="text-rose-100">
                Finalize registration by assigning a unique Membership ID.
              </CardDescription>
            </div>

            <div className="bg-white/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-center">
                Suggested MID
                <div className="text-xl">{parseInt(newMidRef?.numid || 0) + 1}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Full Name</p>
                    <p className="text-sm font-bold text-slate-900">{memberData?.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Mobile No</p>
                    <p className="text-sm font-bold text-slate-900">{memberData?.user_mobile_number}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">Paid Amount</p>
                    <p className="text-sm font-bold text-slate-900">₹{memberData?.priceaga}</p>
                </div>
                <div className="space-y-1 col-span-2">
                    <p className="text-[10px] font-black uppercase text-slate-400">Member Type</p>
                    <p className="text-sm font-bold text-slate-900">{memberData?.member_type}</p>
                </div>
            </div>

            <form id="assignMidForm" onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="user_mid" className="text-slate-700 font-bold">New MID (4 Digits)</Label>
                        <Input 
                            id="user_mid" 
                            name="user_mid" 
                            required 
                            maxLength={4} 
                            placeholder="e.g. 1234"
                            value={formData.user_mid}
                            onChange={onInputChange}
                            className="h-14 rounded-xl border-slate-200 focus:ring-primary text-lg font-black text-center"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount_num" className="text-slate-700 font-bold">Transaction Details</Label>
                        <Input 
                            id="amount_num" 
                            name="amount_num" 
                            required 
                            placeholder="Ref / Chq / Cash No"
                            value={formData.amount_num}
                            onChange={onInputChange}
                            className="h-14 rounded-xl border-slate-200 focus:ring-primary"
                        />
                    </div>

                </div>
            </form>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl h-12 px-8 text-slate-500 font-medium">
                Cancel
            </Button>
            <Button 
                form="assignMidForm" 
                type="submit" 
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-14 rounded-2xl font-black text-lg shadow-xl shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >

                {submitting ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Finishing...
                    </>
                ) : (
                    <>
                        <FiSave /> Assign & Activate
                    </>
                )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewMidAssign;

