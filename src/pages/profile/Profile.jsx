import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiUsers,
  FiSave,
  FiArrowLeft,
  FiHome,
  FiAward,
  FiCamera,
  FiHeart,
  FiAnchor,
  FiInfo,
  FiFileText,
} from "react-icons/fi";
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

const mailAddressOptions = [
  { value: "Residence", label: "Residence" },
  { value: "Office", label: "Office" },
];

const yesorno = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [gottras, setGotras] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiledoc, setSelectedFileDoc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, gotraRes, stateRes] = await Promise.all([
          apiClient.get(WEB_API.fetchProfile),
          apiClient.get(WEB_API.fetchGotra),
          apiClient.get(WEB_API.fetchState),
        ]);
        setProfile(profileRes.data?.userdata);
        setGotras(gotraRes.data?.gotradata || []);
        setStates(stateRes.data?.statedata || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const validateOnlyText = (inputtxt) => {
    var re = /^[A-Za-z ]+$/;
    if (inputtxt === "" || re.test(inputtxt)) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    const digitFields = [
      "user_mobile_number",
      "spouse_mobile",
      "father_mobile",
      "residential_pin",
      "office_pin",
      "office_phone",
      "whats_app",
      "user_resident_to_bang_since",
      "f_mintrophone",
      "f_mmemno",
    ];
    const textFields = [
      "name",
      "spouse_name",
      "father_name",
      "native_place",
      "residential_city",
      "office_city",
      "f_mintroby",
      "org_name",
    ];

    if (digitFields.includes(name)) {
      if (!validateOnlyDigits(value)) return;
    } else if (textFields.includes(name)) {
      if (!validateOnlyText(value)) return;
    }

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      return;
    }

    setUpdating(true);
    const data = new FormData();

    // Explicit mapping as per profile keys
    data.append("appli_name", profile.name || "");
    data.append("user_gender", profile.user_gender || "");
    data.append("user_mobile_number", profile.user_mobile_number || "");
    data.append("user_qualification", profile.user_qualification || "");
    data.append(
      "user_proof_identification",
      profile.user_proof_identification || "",
    );
    data.append("email", profile.email || "");
    data.append("f_mgotra", profile.gotra || "");
    data.append("f_mdob", profile.user_dob || "");
    data.append("f_mblood", profile.user_blood || "");
    data.append("f_mstate", profile.state || "");
    if (selectedFile) data.append("agrawal_images", selectedFile);
    if (selectedFiledoc) data.append("user_proof_docs", selectedFiledoc);
    data.append("married", profile.married || "");
    data.append("f_mannidate", profile.f_mannidate || "");
    data.append("spouse_name", profile.spouse_name || "");
    data.append("user_pan_no", profile.user_pan_no || "");
    data.append("spouse_mobile", profile.spouse_mobile || "");
    data.append("spouse_dob", profile.spouse_dob || "");
    data.append("spouse_blood_group", profile.spouse_blood_group || "");
    data.append("spouse_qualification", profile.spouse_qualification || "");
    data.append("father_name", profile.father_name || "");
    data.append("father_mobile", profile.father_mobile || "");
    data.append("father_dob", profile.father_dob || "");
    data.append("native_place", profile.native_place || "");
    data.append("residential_add", profile.residential_add || "");
    data.append("residential_landmark", profile.residential_landmark || "");
    data.append("residential_city", profile.residential_city || "");
    data.append("residential_pin", profile.residential_pin || "");
    data.append("office_add", profile.office_add || "");
    data.append("office_landmark", profile.office_landmark || "");
    data.append("office_city", profile.office_city || "");
    data.append("office_pin", profile.office_pin || "");
    data.append("office_phone", profile.office_phone || "");
    data.append("mailaddress", profile.mailaddress || "");
    data.append(
      "user_resident_to_bang_since",
      profile.user_resident_to_bang_since || "",
    );
    data.append("donate_blood", profile.donate_blood || "");
    data.append("whats_app", profile.whats_app || "");
    data.append("f_mintroby", profile.f_mintroby || "");
    data.append("f_mmemno", profile.f_mmemno || "");
    data.append("f_mintrophone", profile.f_mintrophone || "");
    data.append("f_mintroadd", profile.f_mintroadd || "");
    data.append("f_motherorga", profile.f_motherorga || "");
    data.append("org_name", profile.org_name || "");
    data.append("org_type", profile.org_type || "");
    data.append("org_product", profile.org_product || "");


    try {
      const response = await apiClient.post(WEB_API.updateProfile, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.code === 200 || response.data.code === "200") {
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(response.data.msg || "Update failed");
      }
    } catch (error) {
      toast.error("Error updating profile");
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
    : profile.agrawal_image
      ? `${IMAGE_BASE_URL}${profile.agrawal_image}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const docPreviewUrl = selectedFiledoc
    ? URL.createObjectURL(selectedFiledoc)
    : profile.user_proof_doc
      ? `${DOC_BASE_URL}${profile.user_proof_doc}`
      : null;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20 animate-in fade-in duration-500 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            User Profile
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your member details and community interaction.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 md:flex-none gap-2 rounded-xl h-11 px-6"
          >
            <FiArrowLeft /> Back
          </Button>
          <Button
            form="addIndiv"
            type="submit"
            disabled={updating}
            className="flex-1 md:flex-none gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white h-11 px-8 shadow-lg shadow-pink-100 transition-all active:scale-95"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FiSave />
            )}{" "}
            Save Changes
          </Button>
        </div>
      </div>

      <form id="addIndiv" onSubmit={handleUpdateProfile} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Area (Left side photo and id proof) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-md overflow-hidden bg-white sticky top-24">
              <CardContent className="p-2 space-y-1">
                <div className="p-4 mb-2 border-b border-slate-50 text-center">
                  <div className="w-28 h-28 rounded-3xl mx-auto bg-slate-100 border-4 border-white overflow-hidden mb-3 shadow-xl relative group">
                    <img
                      src={profileImage}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                    <Label
                      htmlFor="profile_image"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FiCamera className="text-white w-6 h-6" />
                    </Label>
                    <input
                      id="profile_image"
                      type="file"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      accept="image/*"
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Mid: {profile.user_mid || "Pending"}
                  </p>
                </div>

                <div className="px-4 py-4">
                  <Label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                    ID Proof Document Preview
                  </Label>
                  <div className="space-y-3">
                    {docPreviewUrl && (
                      <div className="relative group w-full h-24 rounded-xl overflow-hidden border bg-slate-50">
                        <img
                          src={docPreviewUrl}
                          alt="ID Proof"
                          className="w-full h-full object-cover"
                        />
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
                      <FiFileText className="text-primary" />
                      <span className="text-[10px] text-slate-500 truncate flex-1">
                        {selectedFiledoc
                          ? selectedFiledoc.name
                          : profile.user_proof_doc || "No document"}
                      </span>
                      <Label
                        htmlFor="doc_proof"
                        className="text-primary hover:underline cursor-pointer text-[10px] font-bold whitespace-nowrap"
                      >
                        Change
                      </Label>
                      <input
                        id="doc_proof"
                        type="file"
                        className="hidden"
                        onChange={(e) => setSelectedFileDoc(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area (RHS) */}
          <div className="lg:col-span-3 space-y-8">
            {/* 1. Personal Information */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-pink-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FiUser className="text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                <div className="space-y-2">
                  <Label>Full Name*</Label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender*</Label>
                  <Select
                    onValueChange={(v) => handleSelectChange("user_gender", v)}
                    value={profile.user_gender}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gotra*</Label>
                  <Select
                    onValueChange={(v) => handleSelectChange("gotra", v)}
                    value={profile.gotra}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {gottras.map((o) => (
                        <SelectItem key={o.gotra_name} value={o.gotra_name}>
                          {o.gotra_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State*</Label>
                  <Select
                    onValueChange={(v) => handleSelectChange("state", v)}
                    value={profile.state}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((o) => (
                        <SelectItem key={o.state_name} value={o.state_name}>
                          {o.state_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mobile No*</Label>
                  <Input
                    name="user_mobile_number"
                    value={profile.user_mobile_number}
                    onChange={onInputChange}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email ID*</Label>
                  <Input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>DOB*</Label>
                  <Input
                    type="date"
                    name="user_dob"
                    value={profile.user_dob}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    onValueChange={(v) => handleSelectChange("user_blood", v)}
                    value={profile.user_blood}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Qualification*</Label>
                  <Input
                    name="user_qualification"
                    value={profile.user_qualification}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID Proof Type*</Label>
                  <Select
                    onValueChange={(v) =>
                      handleSelectChange("user_proof_identification", v)
                    }
                    value={profile.user_proof_identification}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {identificationOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>PAN No*</Label>
                  <Input
                    name="user_pan_no"
                    value={profile.user_pan_no}
                    onChange={onInputChange}
                    maxLength={10}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Family Info */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-pink-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FiUsers className="text-primary" /> Family Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Are you Married *</Label>
                    <Select
                      onValueChange={(v) => handleSelectChange("married", v)}
                      value={profile.married}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {marriedOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {profile.married === "Yes" && (
                    <>
                      <div className="space-y-2">
                        <Label>Anniversary Date</Label>
                        <Input
                          type="date"
                          name="f_mannidate"
                          value={profile.f_mannidate}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Spouse Name</Label>
                        <Input
                          name="spouse_name"
                          value={profile.spouse_name}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Spouse Mobile No</Label>
                        <Input
                          name="spouse_mobile"
                          value={profile.spouse_mobile}
                          onChange={onInputChange}
                          maxLength={10}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Spouse DOB</Label>
                        <Input
                          type="date"
                          name="spouse_dob"
                          value={profile.spouse_dob}
                          onChange={onInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Spouse Blood Group</Label>
                        <Select
                          onValueChange={(v) =>
                            handleSelectChange("spouse_blood_group", v)
                          }
                          value={profile.spouse_blood_group}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodOptions.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Spouse Qualification</Label>
                        <Input
                          name="spouse_qualification"
                          value={profile.spouse_qualification}
                          onChange={onInputChange}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Father Name*</Label>
                    <Input
                      name="father_name"
                      value={profile.father_name}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Father DOB</Label>
                    <Input
                      type="date"
                      name="father_dob"
                      value={profile.father_dob}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Father Mobile No*</Label>
                    <Input
                      name="father_mobile"
                      value={profile.father_mobile}
                      onChange={onInputChange}
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label>Native Place*</Label>
                    <Input
                      name="native_place"
                      value={profile.native_place}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Contact Information */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-pink-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FiMapPin className="text-primary" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 md:col-span-4">
                    <Label>Residential Address*</Label>
                    <Input
                      name="residential_add"
                      value={profile.residential_add}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Landmark*</Label>
                    <Input
                      name="residential_landmark"
                      value={profile.residential_landmark}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City*</Label>
                    <Input
                      name="residential_city"
                      value={profile.residential_city}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pin Code*</Label>
                    <Input
                      name="residential_pin"
                      value={profile.residential_pin}
                      onChange={onInputChange}
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-4 pt-4">
                    <Label>Office Address</Label>
                    <Input
                      name="office_add"
                      value={profile.office_add}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Landmark</Label>
                    <Input
                      name="office_landmark"
                      value={profile.office_landmark}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      name="office_city"
                      value={profile.office_city}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pin Code</Label>
                    <Input
                      name="office_pin"
                      value={profile.office_pin}
                      onChange={onInputChange}
                      maxLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Office Phone</Label>
                    <Input
                      name="office_phone"
                      value={profile.office_phone}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>WhatsApp No*</Label>
                    <Input
                      name="whats_app"
                      value={profile.whats_app}
                      onChange={onInputChange}
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mail Address*</Label>
                    <Select
                      onValueChange={(v) =>
                        handleSelectChange("mailaddress", v)
                      }
                      value={profile.mailaddress}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {mailAddressOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Since in Bangalore (Year)*</Label>
                    <Input
                      name="user_resident_to_bang_since"
                      value={profile.user_resident_to_bang_since}
                      onChange={onInputChange}
                      maxLength={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Donate Blood?*</Label>
                    <Select
                      onValueChange={(v) =>
                        handleSelectChange("donate_blood", v)
                      }
                      value={profile.donate_blood}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesorno.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Introduction Information */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b border-pink-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FiAward className="text-primary" /> Introduction Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                <div className="space-y-2">
                  <Label>Introduced By (Member Name)*</Label>
                  <Input
                    name="f_mintroby"
                    value={profile.f_mintroby}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Membership No of Introducer*</Label>
                  <Input
                    name="f_mmemno"
                    value={profile.f_mmemno}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone No of Introducer*</Label>
                  <Input
                    name="f_mintrophone"
                    value={profile.f_mintrophone}
                    onChange={onInputChange}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address of Introducer*</Label>
                  <Input
                    name="f_mintroadd"
                    value={profile.f_mintroadd}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Member of any other organisation*</Label>
                  <Select
                    onValueChange={(v) => handleSelectChange("f_motherorga", v)}
                    value={profile.f_motherorga}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {yesorno.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {profile.f_motherorga === "Yes" && (
                  <>
                    <div className="space-y-2">
                      <Label>Organisation Name</Label>
                      <Input
                        name="org_name"
                        value={profile.org_name}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organisation Type</Label>
                      <Input
                        name="org_type"
                        value={profile.org_type}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organisation Product</Label>
                      <Input
                        name="org_product"
                        value={profile.org_product}
                        onChange={onInputChange}
                      />
                    </div>
                  </>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
