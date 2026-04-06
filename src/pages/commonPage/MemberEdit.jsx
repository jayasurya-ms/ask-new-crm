import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  FiUser, FiMapPin, FiBriefcase, FiPhone, FiMail, FiCalendar, 
  FiCreditCard, FiUsers, FiSave, FiArrowLeft, FiInfo, FiHeart, FiAward,
  FiFileText, FiCamera, FiHome, FiAnchor
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WEB_API } from "@/constants/apiConstants";
import apiClient from "@/api/apiClient";
import { IMAGE_BASE_URL, DOC_BASE_URL } from "@/config/base-url";
import { Loader2 } from "lucide-react";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const bloodOptions = [
  { value: "A +", label: "A +" },
  { value: "A -", label: "A -" },
  { value: "B +", label: "B +" },
  { value: "B -", label: "B -" },
  { value: "O +", label: "O +" },
  { value: "O -", label: "O -" },
  { value: "AB +", label: "AB +" },
  { value: "AB -", label: "AB -" },
];

const identificationOptions = [
  { value: "Aadhar Card", label: "Aadhar Card" },
  { value: "PassPort", label: "PassPort" },
  { value: "Pan Card", label: "Pan Card" },
];

const marriedOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const MemberEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [gottras, setGotras] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiledoc, setSelectedFileDoc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberRes, gotraRes, stateRes] = await Promise.all([
          apiClient.get(WEB_API.fetchMemberView(id)),
          apiClient.get(WEB_API.fetchGotra),
          apiClient.get(WEB_API.fetchState),
        ]);
        setFormData(memberRes.data?.userdata);
        setGotras(gotraRes.data?.gotradata || []);
        setStates(stateRes.data?.statedata || []);
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast.error("Failed to load member data");
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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const data = new FormData();
    
    // Explicitly append all fields as per legacy implementation
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    if (selectedFile) data.append("agrawal_image", selectedFile);
    if (selectedFiledoc) data.append("user_proof_doc", selectedFiledoc);

    try {
      const response = await apiClient.post(WEB_API.updateMemberAdmin(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.code === 200 || response.data.code === "200") {
        toast.success("Member details updated successfully");
        const editSource = localStorage.getItem("edit") || "/home";
        navigate(editSource);
        localStorage.removeItem("edit");
      } else {
        toast.error(response.data.msg || "Update failed due to server error");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profileImage = selectedFile 
    ? URL.createObjectURL(selectedFile) 
    : formData.agrawal_image 
      ? `${IMAGE_BASE_URL}${formData.agrawal_image}` 
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const docPreviewUrl = selectedFiledoc 
    ? URL.createObjectURL(selectedFiledoc) 
    : formData.user_proof_doc 
      ? `${DOC_BASE_URL}${formData.user_proof_doc}` 
      : null;



  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20 mt-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
              <div className="flex gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">MID: {formData.user_mid || 'N/A'}</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Admin Mode</span>
              </div>
          </div>
          <p className="text-slate-500 font-medium">Complete administrative control over member information.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={() => navigate(-1)} variant="outline" className="flex-1 md:flex-none gap-2 rounded-xl border-slate-200 h-11 px-6">
            <FiArrowLeft /> Back
          </Button>
          <Button onClick={handleUpdate} disabled={updating} className="flex-1 md:flex-none gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white h-11 px-8 shadow-lg shadow-pink-100 transition-all active:scale-95">
            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FiSave />} Update All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs - Left Column */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-md overflow-hidden bg-white sticky top-24">
              <CardContent className="p-2 space-y-1">
                 <div className="p-4 mb-2 border-b border-slate-50 text-center">
                    <div className="w-24 h-24 rounded-2xl mx-auto bg-slate-100 border-2 border-slate-50 overflow-hidden mb-3 shadow-inner relative group">
                        <img 
                          src={profileImage} 
                          className="w-full h-full object-cover" 
                          alt="Profile" 
                        />
                        <Label htmlFor="member_image" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <FiCamera className="text-white w-6 h-6" />
                        </Label>
                        <input id="member_image" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{formData.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">{formData.user_mid}</p>
                 </div>
                 
                 <div className="space-y-4 p-4 text-xs font-semibold text-slate-500 uppercase tracking-widest px-6">
                    Documentation
                 </div>
                  <div className="px-4 pb-4">
                    <Label className="block text-xs mb-2 text-slate-400">ID Proof Document</Label>
                    <div className="space-y-3">
                        {docPreviewUrl && (
                            <div className="relative group mx-auto w-full h-24 rounded-xl overflow-hidden border bg-slate-50">
                                <img src={docPreviewUrl} alt="ID Proof" className="w-full h-full object-cover" />
                                <a 
                                    href={docPreviewUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold"
                                >
                                    VIEW DOCUMENT
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-dashed border-slate-200">
                            <FiFileText className="text-blue-600" />
                            <span className="text-[10px] text-slate-500 truncate flex-1">{selectedFiledoc ? selectedFiledoc.name : formData.user_proof_doc || 'No document'}</span>
                            <Label htmlFor="member_doc" className="text-blue-700 hover:text-blue-800 cursor-pointer text-[10px] whitespace-nowrap">Change</Label>
                            <input id="member_doc" type="file" className="hidden" onChange={(e) => setSelectedFileDoc(e.target.files[0])} />
                        </div>
                    </div>
                  </div>
              </CardContent>
           </Card>
        </div>

        {/* Form Sections - Right Columns */}
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="bg-white border p-1 rounded-2xl w-full justify-start overflow-x-auto shadow-sm mb-6 h-14">
              <TabsTrigger value="personal" className="rounded-xl px-6 data-[state=active]:bg-primary/5 data-[state=active]:text-primary gap-2"><FiUser /> Personal</TabsTrigger>
              <TabsTrigger value="family" className="rounded-xl px-6 data-[state=active]:bg-primary/5 data-[state=active]:text-primary gap-2"><FiUsers /> Family</TabsTrigger>
              <TabsTrigger value="address" className="rounded-xl px-6 data-[state=active]:bg-primary/5 data-[state=active]:text-primary gap-2"><FiHome /> Address</TabsTrigger>
              <TabsTrigger value="professional" className="rounded-xl px-6 data-[state=active]:bg-primary/5 data-[state=active]:text-primary gap-2"><FiBriefcase /> Professional</TabsTrigger>
              <TabsTrigger value="community" className="rounded-xl px-6 data-[state=active]:bg-primary/5 data-[state=active]:text-primary gap-2"><FiAward /> Community</TabsTrigger>
            </TabsList>


            <TabsContent value="personal" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg">Basic Personal Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={formData.name} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Gender</Label>
                    <Select onValueChange={(v) => handleSelectChange("user_gender", v)} value={formData.user_gender}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{genderOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Gotra</Label>
                    <Select onValueChange={(v) => handleSelectChange("gotra", v)} value={formData.gotra}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{gottras.map(o => <SelectItem key={o.gotra_name} value={o.gotra_name}>{o.gotra_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" name="user_dob" value={formData.user_dob} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Blood Group</Label>
                    <Select onValueChange={(v) => handleSelectChange("user_blood", v)} value={formData.user_blood}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{bloodOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Qualification</Label><Input name="user_qualification" value={formData.user_qualification} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Mobile No</Label><Input name="user_mobile_number" value={formData.user_mobile_number} onChange={onInputChange} maxLength={10} /></div>
                  <div className="space-y-2"><Label>WhatsApp No</Label><Input name="whats_app" value={formData.whats_app} onChange={onInputChange} maxLength={10} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input name="email" value={formData.email} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Identification Type</Label>
                    <Select onValueChange={(v) => handleSelectChange("user_proof_identification", v)} value={formData.user_proof_identification}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{identificationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>PAN No</Label><Input name="user_pan_no" value={formData.user_pan_no} onChange={onInputChange} maxLength={10} /></div>
                  <div className="space-y-2"><Label>Native Place</Label><Input name="native_place" value={formData.native_place} onChange={onInputChange} /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg">Spouse & Marriage Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-2"><Label>Marital Status</Label>
                    <Select onValueChange={(v) => handleSelectChange("married", v)} value={formData.married}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{marriedOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {formData.married === "Yes" && (
                    <>
                      <div className="space-y-2"><Label>Anniversary Date</Label><Input type="date" name="f_mannidate" value={formData.f_mannidate} onChange={onInputChange} /></div>
                      <div className="space-y-2"><Label>Spouse Name</Label><Input name="spouse_name" value={formData.spouse_name} onChange={onInputChange} /></div>
                      <div className="space-y-2"><Label>Spouse Mobile</Label><Input name="spouse_mobile" value={formData.spouse_mobile} onChange={onInputChange} maxLength={10} /></div>
                      <div className="space-y-2"><Label>Spouse DOB</Label><Input type="date" name="spouse_dob" value={formData.spouse_dob} onChange={onInputChange} /></div>
                      <div className="space-y-2"><Label>Spouse Blood Group</Label>
                        <Select onValueChange={(v) => handleSelectChange("spouse_blood_group", v)} value={formData.spouse_blood_group}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>{bloodOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Spouse Qualification</Label><Input name="spouse_qualification" value={formData.spouse_qualification} onChange={onInputChange} /></div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg flex items-center gap-2"><FiAnchor className="text-blue-600" /> Father's Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-2"><Label>Father Name</Label><Input name="father_name" value={formData.father_name} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Father Mobile</Label><Input name="father_mobile" value={formData.father_mobile} onChange={onInputChange} maxLength={10} /></div>
                  <div className="space-y-2"><Label>Father DOB</Label><Input type="date" name="father_dob" value={formData.father_dob} onChange={onInputChange} /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg flex items-center gap-2"><FiHome className="text-primary" /> Residential Address</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input name="residential_add" value={formData.residential_add} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Landmark</Label><Input name="residential_landmark" value={formData.residential_landmark} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>City</Label><Input name="residential_city" value={formData.residential_city} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Pincode</Label><Input name="residential_pin" value={formData.residential_pin} onChange={onInputChange} maxLength={6} /></div>
                  <div className="space-y-2"><Label>Resident Since (Year)</Label><Input name="user_resident_to_bang_since" value={formData.user_resident_to_bang_since} onChange={onInputChange} /></div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg flex items-center gap-2"><FiBriefcase className="text-blue-600" /> Office Address</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                   <div className="space-y-2 md:col-span-2"><Label>Office Address</Label><Input name="office_add" value={formData.office_add} onChange={onInputChange} /></div>
                   <div className="space-y-2"><Label>Landmark</Label><Input name="office_landmark" value={formData.office_landmark} onChange={onInputChange} /></div>
                   <div className="space-y-2"><Label>City</Label><Input name="office_city" value={formData.office_city} onChange={onInputChange} /></div>
                   <div className="space-y-2"><Label>Pincode</Label><Input name="office_pin" value={formData.office_pin} onChange={onInputChange} maxLength={6} /></div>
                   <div className="space-y-2"><Label>Office Phone</Label><Input name="office_phone" value={formData.office_phone} onChange={onInputChange} /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg">Business & Organization Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-2"><Label>Organization Name</Label><Input name="org_name" value={formData.org_name} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Organization Type</Label><Input name="org_type" value={formData.org_type} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Main Product/Service</Label><Input name="org_product" value={formData.org_product} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Other Organizations</Label><Input name="f_motherorga" value={formData.f_motherorga} onChange={onInputChange} /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <Card className="border-none shadow-md">
                <CardHeader className="border-b pb-4"><CardTitle className="text-lg flex items-center gap-2"><FiAward className="text-primary" /> Membership & Community</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-2"><Label>Introduced By</Label><Input name="f_mintroby" value={formData.f_mintroby} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Introducer MID</Label><Input name="f_mmemno" value={formData.f_mmemno} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Introducer Phone</Label><Input name="f_mintrophone" value={formData.f_mintrophone} onChange={onInputChange} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Introducer Address</Label><Input name="f_mintroadd" value={formData.f_mintroadd} onChange={onInputChange} /></div>
                  <div className="space-y-2"><Label>Donate Blood?</Label>
                    <Select onValueChange={(v) => handleSelectChange("donate_blood", v)} value={formData.donate_blood}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="Yes">Yes</SelectItem>
                             <SelectItem value="No">No</SelectItem>
                             <SelectItem value="In Emergency">In Emergency</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Courier Preference</Label>
                    <Select onValueChange={(v) => handleSelectChange("mailaddress", v)} value={formData.mailaddress}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residence">Residence</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Membership ID (Admin Only)</Label><Input name="user_mid" value={formData.user_mid} className="bg-slate-50 font-bold" readOnly /></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberEdit;

