import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Edit, Eye} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {Label} from "@radix-ui/react-label";

export type Users = {
    createdAt: string;
    email: string;
    firstName: string;
    isActive: boolean;
    isAdminUser: boolean;
    isEcomUser: boolean;
    isEmailVerified: boolean;
    lastName: string;
    password: string; // Ideally, passwords shouldn't be included in a frontend structure.
    updatedAt: string;
    _id: string;
    [key: string]: any; // To allow additional properties if needed.
};

export type NavigationState = {
    orders: Users[];
};

export const columns: ColumnDef<Users>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => (
            <div className="flex space-x-2">
                <Label className={`px-5 py-1 rounded-full 
                    ${row.original.isActive ? 'bg-green-400 text-white'
                    : 'bg-red-500 text-white'}`}
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </Label>
            </div>
        ),
    },
];
