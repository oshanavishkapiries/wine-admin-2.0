import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <button
        className="text-blue-500 hover:underline"
        onClick={() => handleAction(row.original)}
      >
        View Details
      </button>
    ),
  },
];

function handleAction(product: Product) {
  alert(`Viewing details for ${product.productName}`);
}
