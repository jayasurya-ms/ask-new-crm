import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FiTrash2, FiPlus, FiSave, FiArrowLeft, FiUsers } from "react-icons/fi";
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

const AddFamilyMember = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      family_member_name: "",
      family_member_relation: "",
      family_member_gender: "",
      family_member_dob: "",
      family_member_qualification: "",
      family_member_occupation: "",
    },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e, index) => {
    const { name, value } = e.target;
    const updatedUsers = [...users];
    updatedUsers[index][name] = value;
    setUsers(updatedUsers);
  };

  const addItem = () => {
    setUsers([
      ...users,
      {
        family_member_name: "",
        family_member_relation: "",
        family_member_gender: "",
        family_member_dob: "",
        family_member_qualification: "",
        family_member_occupation: "",
      },
    ]);
  };

  const removeUser = (index) => {
    if (users.length === 1) {
      toast.error("At least one member is required");
      return;
    }
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let data = {
      no_of_family: users.length,
      userfamily_sub_data: users,
    };

    try {
      const res = await apiClient.post("/create-web-family-member", data);
      if (res.data.code === 200 || res.data.code === "200") {
        toast.success("Family Member(s) added successfully");
        navigate("/family-member");
      } else {
        toast.error(res.data.msg || "Failed to add family member(s)");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-xl">
            <FiPlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Add Family Member Details
            </h1>
            <p className="text-sm text-slate-500">
              Add one or multiple family members to your profile.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/family-member">
            <Button
              variant="outline"
              className="flex gap-2 rounded-xl h-11 px-6 transition-all active:scale-95"
            >
              <FiArrowLeft /> Back to List
            </Button>
          </Link>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        {users.map((user, index) => (
          <Card
            key={index}
            className="border-none shadow-md overflow-hidden relative group"
          >
            {users.length > 1 && (
              <div className="absolute top-0 right-0 p-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUser(index)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <CardHeader className="bg-slate-50/50 border-b py-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                <FiUsers className="w-4 h-4" /> Member #{index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 pt-6 bg-white">
              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor={`name-${index}`}>Member Name *</Label>
                <Input
                  id={`name-${index}`}
                  name="family_member_name"
                  required
                  placeholder="Full Name"
                  onChange={(e) => onChange(e, index)}
                  value={user.family_member_name}
                  className="rounded-xl h-12 focus:ring-pink-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`relation-${index}`}>Relation *</Label>
                <Input
                  id={`relation-${index}`}
                  name="family_member_relation"
                  required
                  placeholder="e.g. Spouse, Son"
                  onChange={(e) => onChange(e, index)}
                  value={user.family_member_relation}
                  className="rounded-xl h-12 focus:ring-pink-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  required
                  onValueChange={(v) => {
                    const e = {
                      target: { name: "family_member_gender", value: v },
                    };
                    onChange(e, index);
                  }}
                  value={user.family_member_gender}
                >
                  <SelectTrigger className="rounded-xl h-12 focus:ring-pink-600">
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
                <Label htmlFor={`dob-${index}`}>DOB *</Label>
                <Input
                  id={`dob-${index}`}
                  name="family_member_dob"
                  required
                  type="date"
                  onChange={(e) => onChange(e, index)}
                  value={user.family_member_dob}
                  className="rounded-xl h-12 focus:ring-pink-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`qualification-${index}`}>Qualification</Label>
                <Input
                  id={`qualification-${index}`}
                  name="family_member_qualification"
                  placeholder="e.g. Master's in IT"
                  onChange={(e) => onChange(e, index)}
                  value={user.family_member_qualification}
                  className="rounded-xl h-12 focus:ring-pink-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`occupation-${index}`}>Occupation</Label>
                <Input
                  id={`occupation-${index}`}
                  name="family_member_occupation"
                  placeholder="e.g. Software Engineer"
                  onChange={(e) => onChange(e, index)}
                  value={user.family_member_occupation}
                  className="rounded-xl h-12 focus:ring-pink-600"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-48 h-12 rounded-xl flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-500 transition-all font-bold text-slate-700"
            onClick={addItem}
          >
            <FiPlus /> Add Another Member
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full md:w-64 h-14 bg-primary hover:bg-primary/90 text-white font-black text-xl rounded-2xl shadow-xl shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-white" />
                Working...
              </>
            ) : (
              <>
                <FiSave /> Submit Details
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFamilyMember;
