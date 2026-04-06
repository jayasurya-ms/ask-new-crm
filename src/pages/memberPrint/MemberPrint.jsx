import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { FiPrinter, FiFileText, FiArrowLeft, FiUser } from "react-icons/fi";
import ReactToPrint from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { IMAGE_BASE_URL } from "@/config/base-url";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";
import "./style.css";

const MemberPrint = () => {
  const componentRef = useRef();
  const [profile, setProfile] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(WEB_API.fetchMemberView(id));
        setProfile(response.data?.userdata);
        setFamilyMembers(response.data?.familydata || []);
      } catch (error) {
        console.error("Error fetching print data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return <div className="p-8 text-center text-slate-500 font-bold">Member not found.</div>;

  const profileImage = profile.agrawal_image 
    ? `${IMAGE_BASE_URL}${profile.agrawal_image}` 
    : null;


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 pb-20 mt-6 no-print">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FiPrinter className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Print Member Profile</h1>
            <p className="text-sm text-slate-500">Generate a professional profile sheet for {profile.name}.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl border-slate-200">
            <FiArrowLeft /> Back
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-pink-100 px-8">
                <FiPrinter className="mr-2" /> Print Document
              </Button>
            )}
            content={() => componentRef.current}
            documentTitle={`Member_${profile.name}_${profile.user_mid || 'Pending'}`}
          />
        </div>
      </div>

      <Card className="bg-white shadow-2xl border-none max-w-[210mm] mx-auto overflow-hidden">
        <CardContent className="p-0">
          <div ref={componentRef} className="print-container p-[10mm] w-full bg-white text-black font-serif">
            {/* Professional Header Section */}
            <div className="text-center mb-8 pb-6 border-b-2 border-black space-y-2">
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-0">Agrawal Samaj (Karnataka) Regd.</h1>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Community Relationship Management Portal</p>
                <div className="flex justify-center gap-6 text-[10px] uppercase font-bold opacity-70 italic pt-1">
                    <span>Bengaluru, Karnataka</span>
                    <span>•</span>
                    <span>Support: info@agrawalsamaj.co</span>
                </div>
            </div>

            <div className="flex gap-8 mb-8 relative min-h-[160px]">
                {/* Profile Image Column */}
                <div className="w-32 h-40 border-4 border-slate-100 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center">
                    {profileImage ? (
                        <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FiUser className="w-12 h-12 text-slate-200" />
                    )}
                </div>

                {/* Core Personal Details */}
                <div className="flex-1 space-y-4">
                    <div className="pb-2 border-b border-dashed border-slate-300">
                        <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Membership ID: <span className="text-black">{profile.user_mid || "PENDING"}</span> • {profile.user_gender} • Gotra: {profile.gotra}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3">
                        <InfoRow label="Date of Birth" value={profile.user_dob ? moment(profile.user_dob).format("DD MMM YYYY") : null} />
                        <InfoRow label="Blood Group" value={profile.user_blood} />
                        <InfoRow label="Qualification" value={profile.user_qualification} />
                        <InfoRow label="Native Place" value={profile.native_place} />
                        <InfoRow label="Father Name" value={profile.father_name} />
                        <InfoRow label="Mobile" value={profile.user_mobile_number} />
                    </div>
                </div>
            </div>

            {/* Marital Status Section */}
            {profile.married === "Yes" && (
                <div className="mb-8 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-white pb-2">Spouse Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                        <InfoRow label="Spouse Name" value={profile.spouse_name} />
                        <InfoRow label="Anniversary" value={profile.f_mannidate ? moment(profile.f_mannidate).format("DD MMM YYYY") : null} />
                        <InfoRow label="Spouse DOB" value={profile.spouse_dob ? moment(profile.spouse_dob).format("DD MMM YYYY") : null} />
                        <InfoRow label="Qualification" value={profile.spouse_qualification} />
                        <InfoRow label="Blood Group" value={profile.spouse_blood_group} />
                    </div>
                </div>
            )}

            {/* Address Sections */}
            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Contact & Address Information</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2 p-4 border border-slate-100 rounded-xl bg-slate-50/20">
                            <h4 className="text-[10px] font-black uppercase text-primary">Residential Address</h4>
                            <p className="text-sm font-medium leading-relaxed">
                                {profile.residential_add}<br />
                                {profile.residential_landmark ? profile.residential_landmark + ", " : ""}{profile.residential_city}<br />
                                {profile.residential_pin}
                            </p>
                        </div>
                        <div className="space-y-2 p-4 border border-slate-100 rounded-xl bg-slate-50/20">
                            <h4 className="text-[10px] font-black uppercase text-blue-700">Office Address</h4>
                            <p className="text-sm font-medium leading-relaxed">
                                {profile.office_add}<br />
                                {profile.office_city} {profile.office_pin}<br />
                                {profile.office_phone ? "Tel: " + profile.office_phone : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Introducer Info */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 mb-20 translate-y-4">
                <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Introduced By</h4>
                    <p className="text-sm font-bold">{profile.f_mintroby || "Samaj Direct Registration"}</p>
                    <p className="text-xs opacity-70">MID: {profile.f_mmemno || "N/A"}</p>
                </div>
                <div className="text-right">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Registration Date</h4>
                    <p className="text-sm font-bold">{moment(profile.created_at).format("DD MMM YYYY")}</p>
                </div>
            </div>

            {/* Professional Footer for Print */}
            <div className="mt-auto pt-20 flex justify-between items-end">
                <div className="space-y-1">
                    <div className="w-48 h-0.5 bg-black" />
                    <p className="text-[10px] font-black uppercase">Member Signature</p>
                </div>
                <div className="space-y-2 text-right">
                    <div className="italic text-xs font-bold mb-4">Digitally verified by Agarwal Samaj CRM Portal</div>
                    <div className="w-48 h-0.5 bg-black ml-auto" />
                    <p className="text-[10px] font-black uppercase">Secretary Signature</p>
                    <p className="text-[8px] font-bold opacity-60">Agrawal Samaj (Karnataka) Regd.</p>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
    <div className="space-y-0.5 pr-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{label}</p>
        <p className="text-sm font-bold text-black">{value || "-"}</p>
    </div>
);

export default MemberPrint;

