import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiUser, FiUsers, FiPhone, FiMail, FiMapPin, FiInfo, FiHeart, 
  FiCalendar, FiBriefcase, FiBook, FiArrowLeft, FiPrinter
} from 'react-icons/fi';
import moment from 'moment';
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
        {value || <span className="text-slate-300 font-normal italic">Not provided</span>}
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
      {badge && <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/20 border-none">{badge}</Badge>}
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
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20 mt-6">
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
                <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">MID: {profile.user_mid || 'Pending'}</Badge>
            </div>
            <p className="text-slate-500 font-medium">{profile.email} • {profile.user_mobile_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={handleBack} variant="outline" className="flex gap-2 rounded-xl h-11 px-6 transition-all active:scale-95 border-slate-200">
               <FiArrowLeft /> Back
            </Button>
            <Button onClick={() => window.print()} className="bg-primary hover:bg-primary/90 text-white flex gap-2 rounded-xl h-11 px-6 shadow-lg shadow-pink-100 transition-all active:scale-95">
                <FiPrinter /> Print Profile
            </Button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Personal Info */}
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <SectionHeader icon={FiUser} title="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <InfoItem icon={FiUser} label="Full Name" value={profile.name} />
                <InfoItem icon={FiInfo} label="Gender" value={profile.user_gender} />
                <InfoItem icon={FiInfo} label="Gotra" value={profile.gotra} />
                <InfoItem icon={FiMapPin} label="State" value={profile.state} />
                <InfoItem icon={FiPhone} label="Mobile" value={profile.user_mobile_number} />
                <InfoItem icon={FiMail} label="Email" value={profile.email} />
                <InfoItem icon={FiCalendar} label="DOB" value={profile.user_dob ? moment(profile.user_dob).format("DD-MM-YYYY") : null} />
                <InfoItem icon={FiHeart} label="Blood Group" value={profile.user_blood} />
                <InfoItem icon={FiBook} label="Qualification" value={profile.user_qualification} />
                <InfoItem icon={FiMapPin} label="Native Place" value={profile.native_place} />
                <InfoItem icon={FiInfo} label="Bng Resident Since" value={profile.user_resident_to_bang_since ? `${profile.user_resident_to_bang_since} Yr` : null} />
                <InfoItem icon={FiHeart} label="Donate Blood" value={profile.donate_blood} />
              </div>
            </CardContent>
          </Card>

          {/* Family Details */}
          <Card className="border-none shadow-md bg-white">
            <CardContent className="pt-6">
              <SectionHeader icon={FiUsers} title="Family Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">Father's Details</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <InfoItem icon={FiUser} label="Father Name" value={profile.father_name} />
                        <InfoItem icon={FiPhone} label="Father Mobile" value={profile.father_mobile} />
                        <InfoItem icon={FiCalendar} label="Father DOB" value={profile.father_dob ? moment(profile.father_dob).format("DD-MM-YYYY") : null} />
                      </div>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">Selective Info</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <InfoItem icon={FiInfo} label="Courier Address" value={profile.mailaddress} />
                        <InfoItem icon={FiBook} label="ID Proof" value={profile.user_proof_identification} />
                        <InfoItem icon={FiInfo} label="PAN Number" value={profile.user_pan_no} />
                      </div>
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
                      <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">Residential Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <InfoItem icon={FiMapPin} label="Address" value={profile.residential_add} />
                        <InfoItem icon={FiMapPin} label="City" value={profile.residential_city} />
                        <InfoItem icon={FiMapPin} label="Landmark" value={profile.residential_landmark} />
                        <InfoItem icon={FiMapPin} label="Pincode" value={profile.residential_pin} />
                      </div>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 px-3 uppercase tracking-tighter">Office Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <InfoItem icon={FiBriefcase} label="Office Address" value={profile.office_add} />
                        <InfoItem icon={FiBriefcase} label="Office City" value={profile.office_city} />
                        <InfoItem icon={FiMapPin} label="Office Landmark" value={profile.office_landmark} />
                        <InfoItem icon={FiPhone} label="Office Phone" value={profile.office_phone} />
                        <InfoItem icon={FiMapPin} label="Office Pin" value={profile.office_pin} />
                      </div>
                  </div>
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
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Relation</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DOB</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {familyMembers.map((member, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{member.family_member_name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{member.family_member_relation}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{member.family_member_gender}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{member.family_member_dob ? moment(member.family_member_dob).format("DD MMM YYYY") : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <Card className="border-none shadow-md bg-white p-6 sticky top-24">
            <SectionHeader icon={FiHeart} title="Marital Info" />
            <div className="space-y-2 mt-4">
                <InfoItem icon={FiHeart} label="Marital Status" value={profile.married} />
                {profile.married === "Yes" && (
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-2 mt-2">
                        <InfoItem icon={FiCalendar} label="Anniversary" value={profile.f_mannidate ? moment(profile.f_mannidate).format("DD MMM YYYY") : null} color="text-primary" />
                        <InfoItem icon={FiUser} label="Spouse Name" value={profile.spouse_name} color="text-primary" />
                        <InfoItem icon={FiPhone} label="Spouse Mobile" value={profile.spouse_mobile} color="text-primary" />
                        <InfoItem icon={FiCalendar} label="Spouse DOB" value={profile.spouse_dob ? moment(profile.spouse_dob).format("DD-MM-YYYY") : null} color="text-primary" />
                        <InfoItem icon={FiHeart} label="Spouse Blood" value={profile.spouse_blood_group} color="text-primary" />
                        <InfoItem icon={FiBook} label="Spouse Qualification" value={profile.spouse_qualification} color="text-primary" />
                    </div>
                )}

            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
                <SectionHeader icon={FiInfo} title="Other Organizations" badge={profile.f_motherorga} />
                {profile.f_motherorga === "Yes" && (
                  <div className="space-y-2 mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <InfoItem icon={FiBriefcase} label="Org Name" value={profile.org_name} />
                      <InfoItem icon={FiInfo} label="Org Type" value={profile.org_type} />
                      <InfoItem icon={FiBriefcase} label="Org Product" value={profile.org_product} />
                  </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
                <SectionHeader icon={FiInfo} title="Introducer" />
                <div className="space-y-2 mt-4">
                    <InfoItem icon={FiUser} label="Name" value={profile.f_mintroby} />
                    <InfoItem icon={FiPhone} label="Contact" value={profile.f_mintrophone} />
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Identification</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 border rounded-2xl border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <FiBook className="text-primary" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">{profile.user_proof_identification || 'ID TYPE'}</p>
                            <p className="text-sm font-black text-slate-900">{profile.user_pan_no || 'NO DATA'}</p>
                        </div>
                    </div>
                    {profile.user_proof_doc && (
                        <a 
                            href={`${DOC_BASE_URL}${profile.user_proof_doc}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-3 w-full border border-pink-100 bg-pink-50/30 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-50 transition-all border-dashed"
                        >
                            <FiPrinter className="w-3 h-3" /> View Identification Document
                        </a>
                    )}
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberView;

