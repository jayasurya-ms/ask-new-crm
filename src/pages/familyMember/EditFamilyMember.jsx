import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { FiEdit, FiSave, FiArrowLeft, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const EditFamilyMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [familymember, setFamilyMember] = useState({
    family_member_name: "",
    family_member_gender: "",
    family_member_dob: "",
    family_member_relation: "",
    family_member_qualification: "",
    family_member_occupation: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(WEB_API.fetchFamilyMemberData(id));
        setFamilyMember(response.data.familydata);
      } catch (error) {
        console.error("Error fetching family member data:", error);
        toast.error("Failed to load family member details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFamilyMember((prev) => ({ ...prev, [name]: value }));
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await apiClient.put(
        WEB_API.updateFamilyMember(id),
        familymember,
      );
      if (res.data.code === 200 || res.data.code === "200") {
        toast.success("Family Member Updated Successfully");
        navigate("/family-member");
      } else {
        toast.error(res.data.msg || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please check the API endpoint.");
    } finally {
      setUpdating(false);
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
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-xl">
            <FiEdit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Update Family Member Details
            </h1>
            <p className="text-sm text-slate-500">
              Edit the details for {familymember.family_member_name}.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/family-member")}
          variant="outline"
          className="flex gap-2 rounded-xl h-11 px-6 shadow-sm transition-all active:scale-95"
        >
          <FiArrowLeft /> Back
        </Button>
      </div>

      <form
        onSubmit={onUpdate}
        className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <Card className="w-full border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b py-6 px-8">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
              <FiUser /> Member Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="family_member_name">Member Name *</Label>
                <Input
                  id="family_member_name"
                  name="family_member_name"
                  required
                  value={familymember.family_member_name}
                  onChange={onInputChange}
                  className="rounded-xl h-12 border-slate-200 focus:ring-pink-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_member_relation">Relation *</Label>
                <Input
                  id="family_member_relation"
                  name="family_member_relation"
                  required
                  value={familymember.family_member_relation}
                  onChange={onInputChange}
                  className="rounded-xl h-12 border-slate-200 focus:ring-pink-600"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  onValueChange={(v) =>
                    handleSelectChange("family_member_gender", v)
                  }
                  value={familymember.family_member_gender}
                >
                  <SelectTrigger className="rounded-xl h-12 border-slate-200 focus:ring-pink-600">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_member_dob">Date of Birth *</Label>
                <Input
                  id="family_member_dob"
                  name="family_member_dob"
                  required
                  type="date"
                  value={familymember.family_member_dob}
                  onChange={onInputChange}
                  className="rounded-xl h-12 border-slate-200 focus:ring-pink-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_member_qualification">
                  Qualification
                </Label>
                <Input
                  id="family_member_qualification"
                  name="family_member_qualification"
                  value={familymember.family_member_qualification}
                  onChange={onInputChange}
                  className="rounded-xl h-12 border-slate-200 focus:ring-pink-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="family_member_occupation">Occupation</Label>
                <Input
                  id="family_member_occupation"
                  name="family_member_occupation"
                  value={familymember.family_member_occupation}
                  onChange={onInputChange}
                  className="rounded-xl h-12 border-slate-200 focus:ring-pink-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/family-member")}
                className="h-12 rounded-xl px-10 text-slate-500 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating}
                className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-12 rounded-xl font-bold shadow-lg shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave /> Update Member
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditFamilyMember;
