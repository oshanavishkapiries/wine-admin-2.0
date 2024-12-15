import { Button } from "@/components/ui/button";
import { useGetMetaQuery } from "@/features/api/metaSlice";
import { useState } from "react";

interface CategorySelectProps {
  categoryId: string;
  setCategoryId: (id: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categoryId, setCategoryId }) => {
  const {
    data: meta,
    isLoading,
    isFetching,
  } = useGetMetaQuery(undefined, {
    pollingInterval: 40000,
    refetchOnMountOrArgChange: true,
  });

  const categoryList = [{ name: "All", _id: "" }];
  if (meta?.data?.wineCategories) {
    categoryList.push(...meta.data.wineCategories);
  }

  const handleCategoryChange = (id: string) => {
    setCategoryId(id); 
  };

  return (
    <div className="w-full flex justify-center items-center gap-2">
      {!isLoading &&
        !isFetching &&
        categoryList.map((item: any) => (
          <Button
            variant="outline"
            key={item._id}
            className={`w-full ${categoryId === item._id && "bg-secondary"}`}
            onClick={() => handleCategoryChange(item._id)}
          >
            {item.name}
          </Button>
        ))}
    </div>
  );
};

export default CategorySelect;
