import { useEffect, useState } from "react";
import { columns, Product } from "@/components/section/product/columns";
import { DataTable } from "@/components/section/product/data-table";
import { useProductListQuery } from "@/features/api/productSlice";
import { Pagination } from "@/components/common/Pagination";

import { Input } from "@/components/ui/input";
import CLoader from "@/components/common/CLoader";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const {
    data: products,
    isLoading,
    isFetching,
    error,
  } = useProductListQuery({
    page,
    limit: 10,
    categoryId: "",
    search,
  }) as any;

  useEffect(() => {
    if (products?.data) {
      const transformedData: Product[] = products.data.docs.map((doc: any) => ({
        id: doc._id,
        productName: doc.name,
        size: doc.sizeTypes[0]?.name || "Unknown",
        region: doc.regions[0]?.region || "Unknown",
        abv: `${doc.abv}%`,
        qty: doc.qtyOnHand,
        vintage: doc.vintage?.year ? `${doc.vintage.year}` : "Unknown",
        unitPrice: doc.unitPrice,
      }));

      setTableData(transformedData);
      setTotalPages(products.data.totalPages);
    }
  }, [products]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  if (isLoading) {
    return <CLoader className="h-[calc(100svh-80px)]" />;
  }

  if (error) {
    return <div>Error loading data.</div>;
  }

  console.log("products", products);

  return (
    <div className="w-full min-h-screen px-2">
      {/* Search */}
      <div className="flex items-center p-4 w-full">
        <Input
          placeholder="Search"
          className="w-full"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      {/* table */}
      {isFetching ? (
        <CLoader className="h-52" />
      ) : (
        <DataTable columns={columns} data={tableData} />
      )}

      {/* pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
