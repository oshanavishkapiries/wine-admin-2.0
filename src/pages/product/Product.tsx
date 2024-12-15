import { useEffect, useState } from "react";
import { columns, Product } from "@/components/section/product/columns";
import { DataTable } from "@/components/section/product/data-table";
import { useProductListQuery } from "@/features/api/productSlice";
import { Pagination } from "@/components/common/Pagination";

import { Input } from "@/components/ui/input";
import CLoader from "@/components/common/CLoader";
import CategorySelect from "@/components/section/product/CategorySelect";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");

  const {
    data: products,
    isLoading,
    isFetching,
    error,
  } = useProductListQuery({
    page,
    limit: 8,
    categoryId,
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
        imageUrl: doc.image,
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
    return <CLoader />;
  }

  if (error) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="w-full p-2">
      {/* Pass setCategoryId and categoryId to CategorySelect */}
      <CategorySelect categoryId={categoryId} setCategoryId={setCategoryId} />

      {/* Search */}
      <div className="flex items-center py-2 w-full">
        <Input
          placeholder="Search"
          className="w-full"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      {isFetching ? (
        <CLoader />
      ) : (
        <DataTable columns={columns} data={tableData} fortable={tableData} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
