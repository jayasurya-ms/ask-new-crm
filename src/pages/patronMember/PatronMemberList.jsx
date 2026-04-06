import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiUserCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/data-table";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";

const PatronMemberList = () => {
  const [patronMemberData, setPatronMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPMemberData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(WEB_API.fetchPatronMember);
      setPatronMemberData(response.data?.patron_member || []);
    } catch (error) {
      console.error("Error fetching Patron Member data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPMemberData();
  }, []);

  const handleView = (id) => {
    localStorage.setItem("view", "/patron-member");
    navigate(`/member-view/${id}`);
  };

  const handleEdit = (id) => {
    localStorage.setItem("edit", "/patron-member");
    navigate(`/member-edit/${id}`);
  };

  const columns = [
    {
      accessorKey: "slNo",
      header: "SL No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "user_mid",
      header: "MID",
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
      accessorKey: "f_mintroby",
      header: "Intro By",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original.id)}
            className="hover:text-primary hover:bg-pink-50"
            title="View"
          >
            <FiEye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original.id)}
            className="hover:text-primary hover:bg-pink-50"
            title="Edit"
          >
            <FiEdit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-xl">
            <FiUserCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patron Members</h1>
            <p className="text-sm text-slate-500">List of all active patron members in the system.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DataTable
          data={patronMemberData}
          columns={columns}
          searchPlaceholder="Search patron members..."
        />
      </div>
    </div>
  );
};

export default PatronMemberList;

