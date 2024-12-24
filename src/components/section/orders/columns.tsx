import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Edit, Eye} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {Label} from "@radix-ui/react-label";

export type Orders = {
    mobileNumber: string;
    paymentMethod: string;
    paymentStatus: string;
    products: any;
    shippingAddress: any;
    status: string;
    totalAmount: number;
    updatedAt: string;
    user: {
        fullName: string;
        [key: string]: any; // Allows additional properties
    };
    _id: string;
};

export type NavigationState = {
    orders: Orders[];
};

export const columns: ColumnDef<Orders>[] = [
    {
        accessorKey: "user.fullName",
        header: "User",
    },
    {
        accessorKey: "mobileNumber",
        header: "Phone",
    },
    {
        accessorKey: "products.length",
        header: "Product Count",
    },
    {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({getValue}) => `$${getValue<number>().toFixed(2)}`,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => (
            <div className="flex space-x-2">
                <Label className={`px-5 py-1 rounded-full 
                    ${row.original.status.toLowerCase() === 'complete' ? 'bg-green-400 text-white'
                    : row.original.status.toLowerCase() === 'cancelled' ? 'bg-red-500 text-white'
                        : row.original.status.toLowerCase() == 'pending' ? 'bg-yellow-400 text-white' : ''}
                            `}
                >
                    {row.original.status}
                </Label>
            </div>
        ),
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({row}) => {
            const navigate = useNavigate();

            const handleNavigate = (order: Orders) => {
                navigate("/orders/details", {state: {order}});
            };

            return (
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleNavigate(row.original)}>
                        <Eye className=" h-4 w-4"/>
                    </Button>
                    <Button variant='outline'>
                        <Edit className="h-4 w-4"/>
                    </Button>
                </div>
            );
        },
    },
];
