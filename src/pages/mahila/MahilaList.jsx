import React, { useEffect, useState } from "react";
import moment from "moment";
import { FiCalendar, FiMapPin, FiClock, FiLayers } from "react-icons/fi";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const MahilaList = () => {
  const [mahilaData, setMahilaData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMahilaData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(WEB_API.fetchMahilaEvents);
      setMahilaData(response.data?.eventsdata || []);
    } catch (error) {
      console.error("Error fetching Mahila events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahilaData();
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
          <span className="font-bold text-slate-900">{row.getValue("event_name")}</span>
          <span className="text-xs text-slate-500 line-clamp-1">{row.original.event_des}</span>
        </div>
      ),
    },
    {
      accessorKey: "event_date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs space-y-1">
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <FiCalendar className="w-3 h-3" /> {moment(row.getValue("event_date")).format("DD MMM YYYY")}
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <FiClock className="w-3 h-3" /> {row.original.event_time}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "event_address",
      header: "Venue",
      cell: ({ row }) => (
        <div className="flex items-start gap-1 text-xs max-w-[200px] text-slate-600 font-medium">
          <FiMapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {row.getValue("event_address")}
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 border-l-4 border-l-pink-600">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-xl">
            <FiLayers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mahila Events</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and view specialized community focus events for women.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={mahilaData}
            searchPlaceholder="Search events..."
          />
        )}
      </div>
    </div>
  );
};

export default MahilaList;

