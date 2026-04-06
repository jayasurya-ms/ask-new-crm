import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiPlus, FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/data-table";
import apiClient from "@/api/apiClient";
import { WEB_API } from "@/constants/apiConstants";
import { Loader2 } from "lucide-react";
import moment from "moment";

const FamilyMemberList = () => {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(WEB_API.fetchFamilyMember);
      setFamilyData(response.data?.familydata || []);
    } catch (error) {
      console.error("Error fetching Family data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const columns = [
    {
      accessorKey: "slNo",
      header: "SL No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "family_member_name",
      header: "Full Name",
    },
    {
      accessorKey: "family_member_gender",
      header: "Gender",
    },
    {
      accessorKey: "family_member_dob",
      header: "Dob",
      cell: ({ row }) => {
        return moment(row.original.family_member_dob).format("DD-MM-YYYY");
      },
    },
    {
      accessorKey: "family_member_relation",
      header: "Relation",
    },
    {
      accessorKey: "family_member_qualification",
      header: "Qualification",
    },
    {
      accessorKey: "family_member_occupation",
      header: "Occupation",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/family-edit/${row.original.id}`)}
          className="hover:text-primary"
        >
          <FiEdit className="h-4 w-4" />
        </Button>
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
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-xl">
            <FiUsers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Family Members
            </h1>
            <p className="text-sm text-slate-500">
              Manage your family member details and relations.
            </p>
          </div>
        </div>
        <Link to="/add-family-member">
          <Button className="bg-primary hover:bg-primary/90 text-white flex gap-2 rounded-xl h-11 px-6 shadow-lg shadow-pink-100 transition-all active:scale-95">
            <FiPlus /> Add Member
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-2">
        <DataTable
          data={familyData}
          columns={columns}
          searchPlaceholder="Search family members..."
        />
      </div>
    </div>
  );
};

export default FamilyMemberList;
