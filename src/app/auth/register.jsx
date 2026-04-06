import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FiUser, FiUsers, FiMapPin, FiFileText, FiCheck, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WEB_API } from "@/constants/apiConstants";
import apiClient from "@/api/apiClient";

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

const bloodDonateOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "In Emergency", label: "In Emergency" },
];

const mailAddressOptions = [
  { value: "Residence", label: "Residence" },
  { value: "Office", label: "Office" },
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    appli_name: "",
    appli_gender: "",
    appli_mno: "",
    appli_email: "",
    f_mgotra: "",
    f_mstate: "",
    f_mdob: "",
    f_mblood: "",
    f_mqualiself: "",
    f_nativeplace: "",
    proof_iden: "",
    proof_pan: "",
    f_mannidate: "",
    f_msname: "",
    f_msmno: "",
    f_msdob: "",
    f_msblood: "",
    f_mqualispouse: "",
    married: "",
    f_mfname: "",
    f_mfmno: "",
    f_mfdob: "",
    f_moffiadd: "",
    f_moffiland: "",
    f_mofficity: "",
    f_moffipin: "",
    f_mresadd: "",
    f_mresland: "",
    f_mrescity: "",
    f_mrespin: "",
    mailaddress: "",
    f_mresibang: "",
    office_phone: "",
    org_name: "",
    org_type: "",
    org_product: "",
    whats_app: "",
    agrawal_image: "",
    upload_doc_proof: "",
    otpcode: "",
    f_motherorga: "",
    priceaga: "5100",
    f_mmemno: "",
    f_mintrophone: "",
    f_mintroadd: "",
    donateblood: "",
    f_mintroby: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiledoc, setSelectedFileDoc] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [topping, setTopping] = useState("5100");
  const [gottras, setGotras] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gotraRes, stateRes] = await Promise.all([
          apiClient.get(WEB_API.fetchGotra),
          apiClient.get(WEB_API.fetchState),
        ]);
        setGotras(gotraRes.data?.gotradata || []);
        setStates(stateRes.data?.statedata || []);
      } catch (error) {
        console.error("Error fetching gotras/states:", error);
      }
    };
    fetchData();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    // Basic validation for numeric fields
    const numericFields = ["appli_mno", "whats_app", "f_mfmno", "f_mrespin", "f_moffipin", "f_mmemno", "f_mintrophone", "f_msmno", "office_phone", "f_mresibang", "otpcode"];
    if (numericFields.includes(name)) {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.appli_mno || formData.appli_mno.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsButtonDisabled(true);
    try {
      const res = await apiClient.post(WEB_API.registerOtp, {
        appli_mno: formData.appli_mno,
      });
      if (res.data.code === 200) {
        toast.success("OTP Sent to Mobile No");
        setOtpSent(true);
      } else {
        toast.error(res.data.msg || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otpcode) {
      toast.error("Please enter the OTP");
      return;
    }
    setIsButtonDisabled(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    if (selectedFile) data.append("agrawal_image", selectedFile);
    if (selectedFiledoc) data.append("upload_doc_proof", selectedFiledoc);

    try {
      const response = await apiClient.post(WEB_API.insertRegister, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.code === 200) {
        toast.success(response.data.msg);
        // Redirect to payment
        if (formData.priceaga === "11100") {
          window.location.href = "https://easebuzz.in/quickpay/txtnulgirt";
        } else {
          window.location.href = "https://easebuzz.in/quickpay/cdnfsvlmyl";
        }
      } else {
        toast.error(response.data.msg || "Registration failed");
      }
    } catch (error) {
      toast.error("Error during registration");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const onPaymentRedirect = (e, type) => {
    e.preventDefault();
    if (type === 1) {
      window.location.href = "https://easebuzz.in/quickpay/txtnulgirt";
    } else {
      window.location.href = "https://easebuzz.in/quickpay/cdnfsvlmyl";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <FiArrowLeft className="w-5 h-5" />
            </Button>
            <img src="https://new.agrawalsamaj.co/assets/logo-LrjSJo0H.png" alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            Already registered? 
            <Button variant="link" className="p-0 h-auto text-pink-600" onClick={(e) => onPaymentRedirect(e, 1)}>Pay for Patron</Button>
            or
            <Button variant="link" className="p-0 h-auto text-pink-600" onClick={(e) => onPaymentRedirect(e, 2)}>Life Member</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Form Column */}
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Join Agarwal Samaj</h1>
            <p className="text-slate-500 text-lg">Complete the form below to register as a member.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-12">
            {/* Personal Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-2">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                  <FiUser className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="appli_name">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="appli_name" name="appli_name" required value={formData.appli_name} onChange={onInputChange} />
                </div>
                
                <div className="space-y-2">
                  <Label>Gender <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("appli_gender", v)} value={formData.appli_gender}>
                    <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>
                      {genderOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Gotra <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("f_mgotra", v)} value={formData.f_mgotra}>
                    <SelectTrigger><SelectValue placeholder="Select Gotra" /></SelectTrigger>
                    <SelectContent>
                      {gottras.map(o => <SelectItem key={o.gotra_name} value={o.gotra_name}>{o.gotra_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>State <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("f_mstate", v)} value={formData.f_mstate}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                      {states.map(o => <SelectItem key={o.state_name} value={o.state_name}>{o.state_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appli_mno">Mobile No <span className="text-red-500">*</span></Label>
                  <Input id="appli_mno" name="appli_mno" required maxLength={10} value={formData.appli_mno} onChange={onInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whats_app">WhatsApp No <span className="text-red-500">*</span></Label>
                  <Input id="whats_app" name="whats_app" required maxLength={10} value={formData.whats_app} onChange={onInputChange} />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="appli_email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="appli_email" name="appli_email" type="email" required value={formData.appli_email} onChange={onInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="f_mdob">Date of Birth <span className="text-red-500">*</span></Label>
                  <Input id="f_mdob" name="f_mdob" type="date" required value={formData.f_mdob} onChange={onInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>Blood Group <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("f_mblood", v)} value={formData.f_mblood}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {bloodOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="f_mqualiself">Qualification <span className="text-red-500">*</span></Label>
                  <Input id="f_mqualiself" name="f_mqualiself" required value={formData.f_mqualiself} onChange={onInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>ID Proof <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("proof_iden", v)} value={formData.proof_iden}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {identificationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proof_pan">PAN No</Label>
                  <Input id="proof_pan" name="proof_pan" maxLength={10} value={formData.proof_pan} onChange={onInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>Married <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("married", v)} value={formData.married}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {marriedOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {formData.married === "Yes" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="f_mannidate">Anniversary</Label>
                      <Input id="f_mannidate" name="f_mannidate" type="date" value={formData.f_mannidate} onChange={onInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f_msname">Spouse Name</Label>
                      <Input id="f_msname" name="f_msname" value={formData.f_msname} onChange={onInputChange} />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Family & Contact */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-2">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                  <FiUsers className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Family & Contact Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <Label className="text-primary font-bold uppercase tracking-wider">Family</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f_mfname">Father's Name <span className="text-red-500">*</span></Label>
                      <Input id="f_mfname" name="f_mfname" required value={formData.f_mfname} onChange={onInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="f_mfmno">Father's Mobile</Label>
                      <Input id="f_mfmno" name="f_mfmno" maxLength={10} value={formData.f_mfmno} onChange={onInputChange} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="f_nativeplace">Native Place <span className="text-red-500">*</span></Label>
                      <Input id="f_nativeplace" name="f_nativeplace" required value={formData.f_nativeplace} onChange={onInputChange} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-primary font-bold uppercase tracking-wider">Residential Details</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="f_mresadd">Residential Address <span className="text-red-500">*</span></Label>
                      <Input id="f_mresadd" name="f_mresadd" required value={formData.f_mresadd} onChange={onInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="f_mrescity">City <span className="text-red-500">*</span></Label>
                        <Input id="f_mrescity" name="f_mrescity" required value={formData.f_mrescity} onChange={onInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="f_mrespin">Pincode <span className="text-red-500">*</span></Label>
                        <Input id="f_mrespin" name="f_mrespin" required maxLength={6} value={formData.f_mrespin} onChange={onInputChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

             {/* Introduction & Other */}
             <section className="space-y-6">
              <div className="flex items-center gap-3 border-b pb-2">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-primary">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Introduction & Others</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="f_mintroby">Introduced By (Member Name) <span className="text-red-500">*</span></Label>
                  <Input id="f_mintroby" name="f_mintroby" required value={formData.f_mintroby} onChange={onInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f_mmemno">Introducer MID <span className="text-red-500">*</span></Label>
                  <Input id="f_mmemno" name="f_mmemno" required value={formData.f_mmemno} onChange={onInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f_mintrophone">Introducer Phone <span className="text-red-500">*</span></Label>
                  <Input id="f_mintrophone" name="f_mintrophone" required maxLength={10} value={formData.f_mintrophone} onChange={onInputChange} />
                </div>
                
                <div className="space-y-2">
                  <Label>Courier Address <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("mailaddress", v)} value={formData.mailaddress}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {mailAddressOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="f_mresibang">Resident in Bng Since (Yr) <span className="text-red-500">*</span></Label>
                  <Input id="f_mresibang" name="f_mresibang" required maxLength={4} value={formData.f_mresibang} onChange={onInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>Donate Blood? <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => handleSelectChange("donateblood", v)} value={formData.donateblood}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {bloodDonateOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* OTP Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-pink-100 flex flex-col gap-6">
              {!otpSent ? (
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label className="text-slate-600 font-medium">Verify your mobile number to submit</Label>
                    <p className="text-xs text-slate-400">An OTP will be sent to {formData.appli_mno || 'your number'}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-12"
                    onClick={handleSendOtp}
                    disabled={isButtonDisabled}
                  >
                    {isButtonDisabled ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="otpcode">Enter OTP <span className="text-red-500">*</span></Label>
                    <Input id="otpcode" name="otpcode" placeholder="Enter 6-digit OTP" maxLength={6} value={formData.otpcode} onChange={onInputChange} className="h-12 text-center text-xl tracking-widest font-bold border-pink-200" />
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-12"
                    onClick={onSubmit}
                    disabled={isButtonDisabled}
                  >
                    {isButtonDisabled ? "Submitting..." : "Submit Registration"}
                  </Button>
                  <Button variant="outline" className="h-12 border-pink-200 text-primary" onClick={() => setOtpSent(false)}>Resend OTP</Button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Sidebar Column - Plans */}
        <div className="lg:w-80 space-y-6">
          <Card className="sticky top-24 border-rose-100 shadow-xl overflow-hidden">
            <CardHeader className="bg-rose-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiFileText className="text-primary" />
                Membership Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 pt-6">
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${topping === '5100' ? 'border-pink-600 bg-pink-50' : 'border-slate-100 bg-white hover:border-pink-200'}`}
                onClick={() => { setTopping('5100'); setFormData(p => ({ ...p, priceaga: '5100' })); }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">Life Member</span>
                  {topping === '5100' && <FiCheck className="text-pink-600" />}
                </div>
                <div className="text-2xl font-black text-primary">₹5,100</div>
                <p className="text-xs text-slate-500 mt-2">Entry: ₹100 + Member: ₹5,000</p>
              </div>

              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${topping === '11100' ? 'border-pink-600 bg-pink-50' : 'border-slate-100 bg-white hover:border-pink-200'}`}
                onClick={() => { setTopping('11100'); setFormData(p => ({ ...p, priceaga: '11100' })); }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">Patron Member</span>
                  {topping === '11100' && <FiCheck className="text-pink-600" />}
                </div>
                <div className="text-2xl font-black text-primary">₹11,100</div>
                <p className="text-xs text-slate-500 mt-2">Entry: ₹100 + Member: ₹11,000</p>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => navigate("/")}>
            <FiArrowLeft /> Back to Login
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Agarwal Samaj. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Register;

