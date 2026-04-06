import React, { useEffect, useState } from "react";
import moment from "moment";
import { FiCalendar, FiMapPin, FiClock, FiStar } from "react-icons/fi";
import { DataTable } from "@/components/ui/data-table";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const SamajList = () => {
  const [samajData, setSamajData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSamajData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(WEB_API.fetchSamajEvents);
      setSamajData(response.data?.eventsdata || []);
    } catch (error) {
      console.error("Error fetching Samaj events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamajData();
  }, []);

  const columns = [
    {
      accessorKey: "index",
      header: "SL No",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "event_name",
      header: "Event",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-800 tracking-tight">{row.getValue("event_name")}</span>
          <span className="text-xs text-slate-500 line-clamp-1">{row.original.event_des}</span>
        </div>
      ),
    },
    {
      accessorKey: "event_date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs font-medium text-slate-600 gap-1">
          <div className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3 text-blue-600" /> {moment(row.getValue("event_date")).format("DD MMM YYYY")}
          </div>
          <div className="flex items-center gap-1 opacity-70">
            <FiClock className="w-3 h-3" /> {row.original.event_time}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "event_address",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-start gap-1 text-xs max-w-[200px] text-slate-500 font-medium">
          <FiMapPin className="w-3 h-3 mt-0.5 text-red-500" /> {row.getValue("event_address")}
        </div>
      ),
    },
    {
      accessorKey: "event_image",
      header: "Preview",
      cell: ({ row }) => {
        const image = row.getValue("event_image");
        const imageUrl = image
          ? `https://agrawalsamaj.co/crmapi/public/app_images/event/${image}`
          : "https://agrawalsamaj.co/public/app_images/event/no_image.jpg";
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img src={imageUrl} alt="Event" className="w-full h-full object-cover" />
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 border-l-4 border-l-blue-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FiStar className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Samaj Events</h1>
            <p className="text-sm text-slate-500 font-medium">Coordinate and view community-wide celebrations and spiritual gatherings.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={samajData}
            searchPlaceholder="Search Samaj events..."
          />
        )}
      </div>
    </div>
  );
};

export default SamajList;

