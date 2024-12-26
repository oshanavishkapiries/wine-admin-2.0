import {ColumnDef} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type IUsers = {
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
    orders: IUsers[];
};

export const columns: ColumnDef<IUsers>[] = [
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
                <Badge variant={row.original.isActive ? "default" : "destructive"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>
        ),
    },
];
