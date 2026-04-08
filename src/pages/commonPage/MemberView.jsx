import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiUsers,
  FiPhone,
  FiMail,
  FiMapPin,
  FiInfo,
  FiHeart,
  FiCalendar,
  FiBriefcase,
  FiBook,
  FiArrowLeft,
  FiPrinter,
} from "react-icons/fi";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api/apiClient";
import { IMAGE_BASE_URL, DOC_BASE_URL } from "@/config/base-url";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const MemberView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(WEB_API.fetchMemberView(id));
        setProfile(response.data?.userdata);
        setFamilyMembers(response.data?.familydata || []);
      } catch (error) {
        console.error("Error fetching member view data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBack = () => {
    const view = localStorage.getItem("view") || "/home";
    navigate(view);
    localStorage.removeItem("view");
  };

  const InfoItem = ({ icon: Icon, label, value, color = "text-slate-500" }) => (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        {label}
      </div>
      <div className="text-sm font-bold text-slate-900 break-words">
        {value || (
          <span className="text-slate-300 font-normal italic">
            Not provided
          </span>
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, badge }) => (
    <div className="flex items-center justify-between mb-4 mt-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
      {badge && (
        <Badge
          variant="secondary"
          className="bg-primary/20 text-primary hover:bg-primary/20 border-none"
        >
          {badge}
        </Badge>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return <div className="p-8 text-center">Member not found.</div>;

  const profileImage = profile.agrawal_image
    ? `${IMAGE_BASE_URL}${profile.agrawal_image}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20 mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex-shrink-0">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.name}
              </h1>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
              MID: {profile.user_mid || "Pending"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex gap-2 rounded-xl h-11 px-6 transition-all active:scale-95 border-slate-200"
          >
            <FiArrowLeft /> Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-1 gap-8">
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Personal Info */}
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <SectionHeader icon={FiUser} title="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <InfoItem
                  icon={FiUser}
                  label="Full Name"
                  value={profile.name}
                />
                <InfoItem
                  icon={FiInfo}
                  label="Gender"
                  value={profile.user_gender}
                />
                <InfoItem icon={FiInfo} label="Gotra" value={profile.gotra} />
                <InfoItem icon={FiMapPin} label="State" value={profile.state} />
                <InfoItem
                  icon={FiPhone}
                  label="Mobile"
                  value={profile.user_mobile_number}
                />
                <InfoItem icon={FiMail} label="Email" value={profile.email} />
                <InfoItem
                  icon={FiCalendar}
                  label="Date Of Birth"
                  value={
                    profile.user_dob
                      ? moment(profile.user_dob).format("DD-MM-YYYY")
                      : null
                  }
                />
                <InfoItem
                  icon={FiHeart}
                  label="Blood Group"
                  value={profile.user_blood}
                />
                <InfoItem
                  icon={FiBook}
                  label="Qualification"
                  value={profile.user_qualification}
                />
                <InfoItem
                  icon={FiMapPin}
                  label="Native Place"
                  value={profile.native_place}
                />
                <InfoItem
                  icon={FiBook}
                  label="Document Type"
                  value={profile.user_proof_identification}
                />
                <InfoItem
                  icon={FiBook}
                  label="PAN Card"
                  value={profile.user_pan_no}
                />
              </div>
            </CardContent>
          </Card>

          {/* Family Details */}
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <SectionHeader icon={FiUsers} title="Family Information" />
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">
                    Father's Details
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <InfoItem
                      icon={FiUser}
                      label="Father Name"
                      value={profile.father_name}
                    />
                    <InfoItem
                      icon={FiCalendar}
                      label="Father DOB"
                      value={
                        profile.father_dob
                          ? moment(profile.father_dob).format("DD-MM-YYYY")
                          : null
                      }
                    />
                    <InfoItem
                      icon={FiPhone}
                      label="Father Mobile"
                      value={profile.father_mobile}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-3 uppercase tracking-tighter">
                    Marital Info - {<FiHeart />} Status :{" "}
                    <p className="text-slate-500 capitalize">
                      {profile.married}
                    </p>
                  </h4>
                  {profile.married === "Yes" && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <InfoItem
                        icon={FiCalendar}
                        label="Anniversary Date"
                        value={
                          profile.anniversary_date
                            ? moment(profile.anniversary_date).format(
                                "DD-MM-YYYY",
                              )
                            : null
                        }
                      />
                      <InfoItem
                        icon={FiUser}
                        label="Spouse Name"
                        value={profile.spouse_name}
                      />
                      <InfoItem
                        icon={FiPhone}
                        label="Spouse Mobile"
                        value={profile.spouse_mobile}
                      />
                      <InfoItem
                        icon={FiBook}
                        label="Spouse Qualification"
                        value={profile.spouse_qualification}
                      />
                      <InfoItem
                        icon={FiCalendar}
                        label="Spouse DOB"
                        value={
                          profile.spouse_dob
                            ? moment(profile.spouse_dob).format("DD-MM-YYYY")
                            : null
                        }
                      />
                      <InfoItem
                        icon={FiHeart}
                        label="Spouse Blood Group"
                        value={profile.spouse_blood_group}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <SectionHeader icon={FiMapPin} title="Contact Information" />
              <div className="space-y-6">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">
                    Residential Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <InfoItem
                      icon={FiMapPin}
                      label="Address"
                      value={profile.residential_add}
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="City"
                      value={profile.residential_city}
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="Landmark"
                      value={profile.residential_landmark}
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="Pincode"
                      value={profile.residential_pin}
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">
                    Office Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <InfoItem
                      icon={FiBriefcase}
                      label="Office Address"
                      value={profile.office_add}
                    />
                    <InfoItem
                      icon={FiBriefcase}
                      label="Office City"
                      value={profile.office_city}
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="Office Landmark"
                      value={profile.office_landmark}
                    />
                    <InfoItem
                      icon={FiPhone}
                      label="Office Phone"
                      value={profile.office_phone}
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="Office Pin"
                      value={profile.office_pin}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INTRODUCTION INFORMATION */}
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <SectionHeader icon={FiUser} title="Introduction Information" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <InfoItem
                  icon={FiUser}
                  label="Introduced By"
                  value={profile.f_mintroby}
                />
                <InfoItem
                  icon={FiInfo}
                  label="Membership no"
                  value={profile.f_mmemno}
                />
                <InfoItem
                  icon={FiInfo}
                  label="Mobile No"
                  value={profile.f_mintrophone}
                />
                <div className="col-span-2">
                  <InfoItem
                    icon={FiMapPin}
                    label="Address"
                    value={profile.f_mintroadd}
                  />
                </div>

                <InfoItem
                  icon={FiUser}
                  label="Member of Other Organizations"
                  value={profile.f_motherorga}
                />

                {profile.f_motherorga === "Yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 col-span-3">
                    <InfoItem
                      icon={FiBook}
                      label="Org Name"
                      value={profile.org_name}
                    />
                    <InfoItem
                      icon={FiBook}
                      label="Org Type"
                      value={profile.org_type}
                    />
                    <InfoItem
                      icon={FiBook}
                      label="Org Products"
                      value={profile.org_product}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Family Members Table-like view */}
          {familyMembers.length > 0 && (
            <Card className="border-none shadow-md bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiUsers className="text-primary" /> Family Members
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Relation
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          DOB
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {familyMembers.map((member, i) => (
                        <tr
                          key={i}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">
                            {member.family_member_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {member.family_member_relation}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {member.family_member_gender}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {member.family_member_dob
                              ? moment(member.family_member_dob).format(
                                  "DD MMM YYYY",
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberView;
