import React, { useState } from "react";
import { toast } from "sonner";
import { FiDownload, FiFileText, FiDatabase } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const DownloadReport = () => {
  const [downloadingSummary, setDownloadingSummary] = useState(false);
  const [downloadingFull, setDownloadingFull] = useState(false);

  const downloadReport = async (url, fileName, setLoader) => {
    try {
      setLoader(true);
      const res = await apiClient.post(url, {}, { responseType: "blob" });
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${fileName} downloaded successfully`);
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      toast.error("Failed to download the report");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FiDownload className="w-6 h-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports & Downloads</h1>
            <p className="text-sm text-slate-500">Export member data and summaries in CSV format.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Summary Report</CardTitle>
            </div>
            <CardDescription>
              A high-level summary of all registered members, including count and basic status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => downloadReport(WEB_API.downloadSummaryReport, "summary.csv", setDownloadingSummary)}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2"
              disabled={downloadingSummary}
            >
              {downloadingSummary ? <Loader2 className="h-5 w-5 animate-spin" /> : <FiDownload />}
              {downloadingSummary ? "Downloading..." : "Download Summary CSV"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-card hover:shadow-lg transition-all border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <FiDatabase className="w-5 h-5 text-primary" />
                </div>

                <CardTitle className="text-xl">Full Data Export</CardTitle>
            </div>
            <CardDescription>
              Export the complete membership database with all profile fields and family details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => downloadReport(WEB_API.downloadFullReport, "full_report.csv", setDownloadingFull)}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              disabled={downloadingFull}
            >
              {downloadingFull ? <Loader2 className="h-5 w-5 animate-spin" /> : <FiDownload />}
              {downloadingFull ? "Generating..." : "Download Full CSV"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DownloadReport;

