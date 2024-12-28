import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { useGetMetaQuery } from "@/features/api/metaSlice";
import {
  useUpdateCategoryMarginMutation,
  useAddSubCategoryMutation,
  useUpdateSubCategoryNameMutation,
  useDeleteSubCategoryMutation,
} from "@/features/api/categorySlice";
import { useNavigate } from "react-router-dom";

//types

type SubCategory = {
  _id: string;
  name: string;
};

type WineCategory = {
  _id: string;
  name: string;
  subCategories: SubCategory[];
  margin: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function CategoryManage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [margins, setMargins] = useState<Record<string, number>>({});
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [editingSubCategory, setEditingSubCategory] = useState<{ id: string; name: string } | null>(null);

  const { data: meta, isLoading } = useGetMetaQuery(undefined, {
    pollingInterval: 40000,
    refetchOnMountOrArgChange: true,
  });

  const [updateMargin] = useUpdateCategoryMarginMutation();
  const [addSubCategory] = useAddSubCategoryMutation();
  const [updateSubCategoryName] = useUpdateSubCategoryNameMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const categories = meta?.data?.wineCategories;

  // Initialize selected category and margins
  useEffect(() => {
    if (categories?.length) {
      setSelectedCategory(categories[0]._id);
      const initialMargins: Record<string, number> = {};
      categories.forEach((cat: WineCategory) => {
        initialMargins[cat._id] = cat.margin;
      });
      setMargins(initialMargins);
    }
  }, [categories]);

  const handleMarginUpdate = async (categoryId: string, newMargin: number) => {
    try {
      await updateMargin({ id: categoryId, margin: newMargin }).unwrap();
      toast.success("Margin updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update margin");
      console.error('Failed to update margin:', error);
    }
  };

  const handleAddSubCategory = async (categoryId: string) => {
    if (!newSubCategoryName.trim()) return;
    try {
      await addSubCategory({ id: categoryId, subCategoryName: newSubCategoryName }).unwrap();
      toast.success("Subcategory added successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to add subcategory");
      console.error('Failed to add subcategory:', error);
    }
  };

  const handleUpdateSubCategory = async (subCategoryId: string, name: string) => {
    try {
      await updateSubCategoryName({ id: subCategoryId, name }).unwrap();
      toast.success("Subcategory updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update subcategory");
      console.error('Failed to update subcategory:', error);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    try {
      await deleteSubCategory({ id: subCategoryId }).unwrap();
      toast.success("Subcategory deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete subcategory");
      console.error('Failed to delete subcategory:', error);
    }
  };

  const renderItemRow = (subCategory: SubCategory) => (
    <div
      key={subCategory._id}
      className="flex justify-between items-center p-4 border rounded-md"
    >
      {editingSubCategory?.id === subCategory._id ? (
        <Input
          value={editingSubCategory.name}
          onChange={(e) => setEditingSubCategory({ ...editingSubCategory, name: e.target.value })}
        />
      ) : (
        <span>{subCategory.name}</span>
      )}
      <div className="space-x-2">
        {editingSubCategory?.id === subCategory._id ? (
          <Button onClick={() => handleUpdateSubCategory(subCategory._id, editingSubCategory.name)}>
            Save
          </Button>
        ) : (
          <Button onClick={() => setEditingSubCategory({ id: subCategory._id, name: subCategory.name })}>
            Edit
          </Button>
        )}
        <Popover>
          <PopoverTrigger>
            <Button variant="destructive">Delete</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Are you sure you want to delete this subcategory?</p>
            <div className="mt-2 space-x-2">
              <Button variant="destructive" onClick={() => handleDeleteSubCategory(subCategory._id)}>
                Yes
              </Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const renderInputSection = (category: WineCategory) => (
    <div className="p-4 border rounded-md space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-gray-600">Category price margin</label>
          <div className="relative">
            <input
              type="number"
              value={margins[category._id] ?? 0}
              onChange={(e) => setMargins(prev => ({ 
                ...prev, 
                [category._id]: Number(e.target.value) 
              }))}
              onBlur={() => handleMarginUpdate(category._id, margins[category._id] ?? 0)}
              className="border p-2 rounded-md w-full pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
          placeholder="New subcategory name"
        />
        <Button onClick={() => handleAddSubCategory(category._id)}>
          Add Subcategory
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <Button className="b" onClick={() => navigate(-1)}>Back</Button>

      <Tabs 
        value={selectedCategory} 
        className="w-full"
        onValueChange={setSelectedCategory}
      >
        <TabsList className="space-x-2 w-full">
          {categories?.map((cat: WineCategory) => (
            <TabsTrigger key={cat._id} value={cat._id} className="w-full">
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          {categories?.map((cat: WineCategory) => (
            <TabsContent key={cat._id} value={cat._id}>
              {renderInputSection(cat)}
              <div className="mt-4 space-y-4">
                {cat.subCategories.map((subCategory) => renderItemRow(subCategory))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
