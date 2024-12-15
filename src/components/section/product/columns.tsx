import { ColumnDef } from "@tanstack/react-table";
import DeletePopup from "./DeletePopup";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export type Product = {
  id: string;
  productName: string;
  size: string;
  region: string;
  abv: string;
  qty: string;
  vintage: string;
  unitPrice: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "abv",
    header: "ABV",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "vintage",
    header: "Vintage",
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        
        <Link to={`/products/details?id=${row.original.id}`}>
          <Button variant="outline">
            <Eye /> View Product
          </Button>
        </Link>

        <DeletePopup item={row.original} />
      </div>
    ),
  },
];
