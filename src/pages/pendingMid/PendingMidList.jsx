import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiEye, FiEdit, FiClock } from "react-icons/fi";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const PendingMidList = () => {
  const [pendingMidData, setPendingMidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPendingMidData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(WEB_API.fetchPendingMid);
      setPendingMidData(response.data?.pending_mid || []);
    } catch (error) {
      console.error("Error fetching Pending Mid data", error);
      toast.error("Failed to load pending MID list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMidData();
  }, []);

  const columns = [
    {
      accessorKey: "index",
      header: "SL No",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: "Full Name",
    },
    {
      accessorKey: "user_mobile_number",
      header: "Mobile",
    },
    {
      accessorKey: "priceaga",
      header: "Amount",
      cell: ({ row }) => <span>₹{row.getValue("priceaga")}</span>,
    },
    {
      accessorKey: "f_mintroby",
      header: "Introduced By",
    },
    {
      accessorKey: "reg_date",
      header: "Reg Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/member-view/${id}`)}
              title="View Profile"
              className="hover:text-blue-600"
            >
              <FiEye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/new-mid-assign/${id}`)}
              title="Assign MID"
              className="hover:text-primary"
            >
              <FiEdit className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-xl">
            <FiClock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pending MID List</h1>
            <p className="text-sm text-slate-500">Registrations awaiting Membership ID assignment.</p>
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
            data={pendingMidData}
            searchPlaceholder="Search by name or mobile..."
          />
        )}
      </div>
    </div>
  );
};

export default PendingMidList;

