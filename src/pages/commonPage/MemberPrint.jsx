import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { IMAGE_BASE_URL } from "@/config/base-url";
import { FaRegFilePdf } from "react-icons/fa";
import moment from "moment";
import pheader from "/img/pheader.png";
import lheader from "/img/lheader.png";
import { AiOutlinePrinter } from "react-icons/ai";
import ReactToPrint from "react-to-print";
import { ContextPanel } from "@/lib/context-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MemberPrint = () => {
  const componentRef = useRef();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileImageBase64, setProfileImageBase64] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const toBase64 = async (url) => {
    try {
      // Fast proxy: corsproxy.io is often quicker than allorigins
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Proxy fetch failed");
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return url; // fallback to original URL
    }
  };

  const fetchLifeTimeData = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const response = await apiClient.get(WEB_API.fetchMemberView(id));
      const userData = response.data?.userdata || {};
      setProfile(userData);

      // Pre-convert profile image to base64 for PDF export
      if (userData.agrawal_image) {
        const originalUrl = `${IMAGE_BASE_URL}${userData.agrawal_image}`;

        // Native-First: Try to load directly with anonymous CORS first
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          setProfileImageBase64(canvas.toDataURL("image/png"));
        };
        img.onerror = async () => {
          // Fallback to proxy if direct load fails
          const base64 = await toBase64(originalUrl);
          setProfileImageBase64(base64);
        };
        img.src = originalUrl;
      }
    } catch (error) {
      console.error("Error fetching member data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLifeTimeData();
  }, [id, isPanelUp]);

  const handleSavePDF = async () => {
    const input = componentRef.current;
    setIsGeneratingPDF(true);

    try {
      // Dynamic imports to optimize bundle size and prevent navigation "blink"
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(input, {
        scale: 2.5, // Faster than 3 but still high-quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5;

      const contentWidth = pageWidth - 2 * margin;
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      let position = 0;

      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          -position + margin,
          imgWidth,
          imgHeight,
          "",
          "NONE", // No compression for highest quality
        );

        position += pageHeight - 2 * margin;
      }

      pdf.save(`${profile.name || "member"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
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
    <div className="container mx-auto p-4 md:p-8 space-y-6 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:hidden">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FaRegFilePdf className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Member Profile
            </h1>
            <p className="text-sm text-slate-500">
              View member details or export to PDF.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ReactToPrint
            trigger={() => (
              <Button variant="outline" className="flex items-center gap-2">
                <AiOutlinePrinter className="w-4 h-4" /> Print
              </Button>
            )}
            content={() => componentRef.current}
            documentTitle={`${profile.name || "member"}`}
          />
          <Button
            variant="default"
            onClick={handleSavePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <FaRegFilePdf className="w-4 h-4" /> Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <CardContent className="p-4 md:p-8">
          <div
            ref={componentRef}
            className="print-container flex flex-col w-full bg-white p-0"
          >
            {/* Header Section */}
            <div className="flex flex-col items-center pt-0">
              <img
                src={pheader}
                alt="header"
                className="header-image w-full object-fit h-auto mb-2"
              />
              <hr className="w-full border-black mb-4" />
            </div>

            {/* Personal Information Section */}
            <div className="p-1">
              <h1 className="mt-0 mb-1 w-full text-purple-700 font-bold text-[1.1rem] uppercase tracking-wider border-b-2 border-purple-100 pb-1">
                Person Information
              </h1>

              <div className="personal-info-box relative border-2 border-dashed rounded-lg p-4 border-green-600/30 bg-green-50/10 mb-4">
                {/* Profile Image */}
                <div className="absolute right-4 top-4">
                  <img
                    src={
                      profileImageBase64 ||
                      (profile.agrawal_image
                        ? `${IMAGE_BASE_URL}${profile.agrawal_image}`
                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
                    }
                    alt="Profile"
                    className="profile-image w-32 h-40 print:w-24 print:h-28 rounded-lg object-cover border-4 border-white shadow-md bg-slate-100"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 font-semibold text-slate-700">
                      Name (Gotra)
                    </span>
                    <span className="hidden sm:inline">:</span>
                    <span className="text-slate-900 pr-36">
                      {profile.name} - {profile.gotra} ({profile.user_gender})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 pr-36">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Date of Birth
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.user_dob
                          ? moment(profile.user_dob).format("DD-MM-YYYY")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Blood Group
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.user_blood || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 pr-36">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Father Name
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.father_name || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Qualification
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.user_qualification || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 pr-36">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Native Place
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.native_place || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Wedd. Date
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.f_mannidate
                          ? moment(profile.f_mannidate).format("DD-MM-YYYY")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 pr-36">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Spouse Name
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.spouse_name || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Date of Birth
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.spouse_dob
                          ? moment(profile.spouse_dob).format("DD-MM-YYYY")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 pr-36">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Qualification
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.spouse_qualification || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="w-32 font-semibold text-slate-700">
                        Blood Group
                      </span>
                      <span className="hidden sm:inline">:</span>
                      <span className="text-slate-900">
                        {profile.spouse_blood_group || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="p-1">
              <h1 className="mt-0 mb-1 w-full text-purple-700 font-bold text-[1.1rem] uppercase tracking-wider border-b-2 border-purple-100 pb-1">
                Residence Address
              </h1>
              <div className="p-4 border-2 border-dashed border-green-600/30 rounded-lg bg-green-50/10 mb-4">
                <div className="text-slate-900 leading-relaxed">
                  {profile.residential_add ||
                  profile.residential_landmark ||
                  profile.residential_city ||
                  profile.residential_pin ? (
                    <>
                      {profile.residential_add} {profile.residential_landmark}
                      {(profile.residential_add ||
                        profile.residential_landmark) &&
                        (profile.residential_city ||
                          profile.residential_pin) && <br />}
                      {profile.residential_city}
                      {profile.residential_city && profile.residential_pin
                        ? " - "
                        : ""}
                      {profile.residential_pin}
                    </>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div className="p-1">
              <h1 className="mt-0 mb-1 w-full text-purple-700 font-bold text-[1.1rem] uppercase tracking-wider border-b-2 border-purple-100 pb-1">
                Office Address
              </h1>
              <div className="p-4 border-2 border-dashed border-green-600/30 rounded-lg bg-green-50/10 mb-4">
                <div className="text-slate-900 leading-relaxed mb-3">
                  {profile.office_add ||
                  profile.office_landmark ||
                  profile.office_city ||
                  profile.office_pin ? (
                    <>
                      {profile.office_add} {profile.office_landmark}
                      {(profile.office_add || profile.office_landmark) &&
                        (profile.office_city || profile.office_pin) && <br />}
                      {profile.office_city}
                      {profile.office_city && profile.office_pin ? " - " : ""}
                      {profile.office_pin}
                    </>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-32 font-semibold text-slate-700">
                      Contact No
                    </span>
                    <span>:</span>
                    <span className="text-slate-900">
                      {profile.office_phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-32 font-semibold text-slate-700">
                      Mailing Add.
                    </span>
                    <span>:</span>
                    <span className="text-slate-900">
                      {profile.mailaddress || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-1">
              <h1 className="mt-0 mb-1 w-full text-purple-700 font-bold text-[1.1rem] uppercase tracking-wider border-b-2 border-purple-100 pb-1">
                Contact Information
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 border-2 border-dashed border-green-600/30 rounded-lg bg-green-50/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-slate-700">
                    Mobile No
                  </span>
                  <span>:</span>
                  <span className="text-slate-900">
                    {profile.user_mobile_number}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-slate-700">
                    Email Id
                  </span>
                  <span>:</span>
                  <span className="text-slate-900 text-sm break-all">
                    {profile.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-slate-700">
                    Mobile No.2
                  </span>
                  <span>:</span>
                  <span className="text-slate-900">
                    {profile.whats_app || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-32 font-semibold text-slate-700">
                    Mobile No.3
                  </span>
                  <span>:</span>
                  <span className="text-slate-900">
                    {profile.f_mintrophone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Intro Members */}
            <div className="p-1">
              <h1 className="mt-0 mb-1 w-full text-purple-700 font-bold text-[1.1rem] uppercase tracking-wider border-b-2 border-purple-100 pb-1">
                Details of Mintro Members
              </h1>
              <div className="p-4 border-2 border-dashed border-green-600/30 rounded-lg bg-green-50/10 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">No.</span>
                    <span>:</span>
                    <span className="text-slate-900">
                      {profile.f_mmemno || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Name</span>
                    <span>:</span>
                    <span className="text-slate-900">
                      {profile.f_mintroby || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Mobile</span>
                    <span>:</span>
                    <span className="text-slate-900">
                      {profile.f_mintrophone || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700 min-w-[70px]">
                    Address
                  </span>
                  <span>:</span>
                  <span className="text-slate-900">
                    {profile.f_mintroadd || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <hr className="w-full border-black my-4" />

            {/* Footer Information */}
            <div className="grid grid-cols-3 gap-4 p-2 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-slate-700">
                  Application Received
                </span>
                <span>:</span>
                <span className="text-slate-900">
                  {profile.priceaga || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm justify-center">
                <span className="font-semibold text-slate-700">MID</span>
                <span>:</span>
                <span className="text-slate-900">{profile.user_mid || ""}</span>
              </div>
              <div className="flex items-center gap-2 text-sm justify-end">
                <span className="font-semibold text-slate-700">Ref.</span>
                <span>:</span>
                <span className="text-slate-900">
                  {profile.amount_num || "N/A"}
                </span>
              </div>
            </div>

            {/* Secretary Signature */}
            <div className="flex justify-end mt-12 p-4">
              <div className="text-center">
                <div className="mb-1 text-slate-600">Secretary</div>
                <div className="font-bold text-slate-900">
                  Agrawal Samaj (Karnataka) Regd.
                </div>
                <div className="text-slate-600">Bangalore</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberPrint;
