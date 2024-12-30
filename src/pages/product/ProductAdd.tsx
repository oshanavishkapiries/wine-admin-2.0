"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formSchema } from "./formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useGetMetaQuery } from "@/features/api/metaSlice";
import { useProductCreateMutation } from "@/features/api/productSlice";
import { toast } from "sonner";

const countries = ["USA", "France", "Spain", "Italy", "Australia"];
const ProductAdd = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const router = useNavigate();
  const { data: meta } = useGetMetaQuery(undefined, {
    pollingInterval: 40000,
    refetchOnMountOrArgChange: true,
  });

  console.log("meta", meta);

  const sizeArrays = meta?.data?.sizeTypes;
  const categoryArrays = meta?.data?.wineCategories;
  const drynessArrays = meta?.data?.drynessLevels;
  const regionsArray = meta?.data?.wineRegions;
  const vintagesArrays = meta?.data?.vintages;
  const collectables = meta?.data?.collectables;

  // vintagesArrayssample = [
  //   {
  //     "_id": "676c4e9a1ba5aeb78ab33544",
  //     "year": 2015,
  //     "description": "Excellent year with balanced acidity and tannins.",
  //     "__v": 0,
  //     "createdAt": "2024-12-25T18:27:38.763Z",
  //     "updatedAt": "2024-12-25T18:27:38.763Z"
  // }
  // ]

  const [createProduct] = useProductCreateMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      greatForGift: false,
    },
  });

  function calculateUnitPrice(packSize: string, packPrice: string) {
    const size = parseFloat(packSize) || 0;
    const price = parseFloat(packPrice) || 0;
    return size > 0 ? (price / size).toFixed(2) : "0.00";
  }

  function calculateTotalPrice(packPrice: string, packDiscount: string) {
    const price = parseFloat(packPrice) || 0;
    const discount = parseFloat(packDiscount) || 0;
    return (price - discount).toFixed(2);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const categoryData = categoryArrays?.find(
        (c: any) => c.name === values.mainCategory
      );
      const subCategoryData = availableSubCategories?.find(
        (sc: any) => sc.name === values.subCategory
      );
      const regionData = regionsArray?.find(
        (r: any) => r.region === values.mainRegion
      );
      const subRegionData = availableSubRegions?.find(
        (sr: any) => sr.name === values.region
      );
      const drynessData = drynessArrays?.find(
        (d: any) => d.name === values.dryness
      );
      const sizeData = sizeArrays?.filter((s: any) =>
        values.sizes?.includes(s.name)
      );
      const vintageData = meta?.data?.vintages?.find(
        (v: any) => v.year == values.vintage
      );

      const collectableData = collectables?.filter((c: any) =>
        values.collectables?.includes(c.name)
      );

      console.log("vintageData", vintageData);

      const imageInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      let imageBase64 = "";
      if (imageInput?.files?.[0]) {
        imageBase64 = await convertFileToBase64(imageInput.files[0]);
      }

      const productData = {
        name: values.productName,
        description: values.description || "",
        unitBuyingPrice: Number(values.unitBuyingPrice) || 0,
        unitPrice: Number(values.unitPrice) || 0,
        packSize: Number(values.packSize) || 0,
        packBuyingPrice: Number(values.packBuyingPrice) || 0,
        packPrice: Number(values.packPrice) || 0,
        rating: Number(values.rating) || 0,
        qtyOnHand: Number(values.quantityOnHand) || 0,
        isGreatForGift: values.greatForGift || false,
        categories: categoryData ? [categoryData._id] : [],
        subCategories: subCategoryData ? [subCategoryData._id] : [],
        regions: regionData ? [regionData._id] : [],
        subRegions: subRegionData ? [subRegionData._id] : [],
        dryness: drynessData?._id || "",
        country: values.country,
        vintage: vintageData ? [vintageData._id] : [],
        abv: Number(values.abv) || 0,
        sizeTypes: sizeData?.map((s: any) => s._id) || [],
        collectables: collectableData?.map((c: any) => c._id) || [],
        inStock: Number(values.quantityOnHand) > 0,
        image: imageBase64 || "",
      };

      console.log(productData);

      await createProduct({ data: productData }).unwrap();
      toast.success("Product created successfully!");
      router("/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product");
      console.error("Product creation error:", error);
    }
  }

  // Add this helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const [selectedMainRegion, setSelectedMainRegion] = useState<string>("");
  const [availableSubRegions, setAvailableSubRegions] = useState<any[]>([]);

  const handleMainRegionChange = (regionName: string) => {
    setSelectedMainRegion(regionName);
    const region = regionsArray?.find((r: any) => r.region === regionName);
    setAvailableSubRegions(region?.subRegions || []);
    form.setValue("region", "");
  };

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>(
    []
  );

  const handleMainCategoryChange = (categoryName: string) => {
    setSelectedMainCategory(categoryName);
    const category = categoryArrays?.find((c: any) => c.name === categoryName);
    setAvailableSubCategories(category?.subCategories || []);
    form.setValue("subCategory", "");
  };

  const handleSizeChange = (value: string, field: any) => {
    const currentSizes = field.value || [];
    const updatedSizes = currentSizes.includes(value)
      ? currentSizes.filter((size: string) => size !== value)
      : [...currentSizes, value];

    field.onChange(updatedSizes);
  };

  const handleCollectablesChange = (value: string, field: any) => {
    const currentCollectables = field.value || [];
    const updatedCollectables = currentCollectables.includes(value)
      ? currentCollectables.filter((item: string) => item !== value)
      : [...currentCollectables, value];

    field.onChange(updatedCollectables);
  };

  return (
    <div className="w-full p-6">
      <Button className="mb-6" onClick={() => router(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mainCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Category *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleMainCategoryChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select main category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryArrays?.map((category: any) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedMainCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSubCategories.map((subCategory: any) => (
                            <SelectItem
                              key={subCategory._id}
                              value={subCategory.name}
                            >
                              {subCategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mainRegion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Region *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleMainRegionChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select main region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regionsArray?.map((region: any) => (
                              <SelectItem
                                key={region._id}
                                value={region.region}
                              >
                                {region.region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Region *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedMainRegion}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sub region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubRegions.map((subRegion: any) => (
                              <SelectItem
                                key={subRegion._id}
                                value={subRegion.name}
                              >
                                {subRegion.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="varietal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Varietal</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter varietal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="abv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ABV % *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Enter ABV"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vintage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vintage *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vintage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vintagesArrays?.map((vintage: any) => (
                            <SelectItem key={vintage._id} value={vintage.year}>
                              {vintage.year} - {vintage.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dryness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dryness *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dryness" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {drynessArrays?.map((level: any) => (
                            <SelectItem key={level._id} value={level.name}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          handleSizeChange(value, field)
                        }
                        value={field.value?.[field.value.length - 1] || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sizes">
                              {(field.value ?? []).length > 0
                                ? `${(field.value ?? []).length} sizes selected`
                                : "Select sizes"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizeArrays?.map((size: any) => (
                            <SelectItem
                              key={size._id}
                              value={size.name}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={field.value?.includes(size.name)}
                                className="mr-2"
                              />
                              <span>{size.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="collectables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collectables</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        handleCollectablesChange(value, field)
                      }
                      value={field.value?.[field.value.length - 1] || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collectables">
                            {(field.value?.length || 0) > 0
                              ? `${
                                  field.value?.length || 0
                                } collectables selected`
                              : "Select collectables"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collectables?.map((collectable: any) => (
                          <SelectItem
                            key={collectable._id}
                            value={collectable.name}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={field.value?.includes(collectable.name)}
                              className="mr-2"
                            />
                            <span>{collectable.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="Enter rating"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price and Discount</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Size *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter pack size"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter pack price"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const unitPrice = calculateUnitPrice(
                              form.getValues("packSize"),
                              e.target.value
                            );
                            form.setValue("unitPrice", unitPrice);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Add new buying price fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packBuyingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Buying Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter pack buying price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitBuyingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Buying Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter unit buying price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter pack discount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter unit price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter unit discount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantityOnHand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity on Hand *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="greatForGift"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Great for Gift</FormLabel>
                      <FormDescription>
                        Mark this product as suitable for gifting
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-semibold">Price Summary</h3>
                <div className="space-y-1">
                  <p>
                    Total Pack Price: $
                    {calculateTotalPrice(
                      form.watch("packPrice") || "0",
                      form.watch("packDiscount") || "0"
                    )}
                  </p>
                  <p>
                    Total Unit Price: $
                    {calculateTotalPrice(
                      form.watch("unitPrice") || "0",
                      form.watch("unitDiscount") || "0"
                    )}
                  </p>
                  <p>
                    Total Discount: $
                    {(
                      parseFloat(form.watch("packDiscount") || "0") +
                      parseFloat(form.watch("unitDiscount") || "0")
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImageUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {imageUrl && (
                  <div className="mt-4">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="max-w-sm rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Save Product
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductAdd;
