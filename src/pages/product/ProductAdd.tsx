import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const mainCategories = [
  "Red Wine",
  "White Wine",
  "Rose Wine",
  "Champagne & Sparkling",
  "Sake",
  "Spirits",
  "Cans & Cocktails",
  "Accessories",
  "Uncategorized",
];

const countries = ["USA", "France", "Italy", "Spain", "Australia"];
const vintageYears = Array.from({ length: 30 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);
const dryness = ["Bone Dry", "Dry", "Off-Dry", "Sweet", "Very Sweet"];
//const sizes = ["187ml", "375ml", "750ml", "1.5L", "3L", "6L"];

const formSchema = z.object({
  mainCategory: z.string().min(1, "Main category is required"),
  subCategory: z.string().min(1, "Sub category is required"),
  productName: z.string().min(1, "Product name is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  varietal: z.string().optional(),
  abv: z.string().min(1, "ABV is required"),
  vintage: z.string().min(1, "Vintage is required"),
  dryness: z.string().min(1, "Dryness is required"),
  sizes: z.array(z.string()).min(1, "At least one size must be selected"),
  description: z.string().optional(),
  rating: z.string().optional(),
  packSize: z.string().min(1, "Pack size is required"),
  packPrice: z.string().min(1, "Pack price is required"),
  packDiscount: z.string().optional(),
  unitPrice: z.string().min(1, "Unit price is required"),
  unitDiscount: z.string().optional(),
  quantityOnHand: z.string().min(1, "Quantity is required"),
  greatForGift: z.boolean().default(false),
  unitPriceMargin: z.string().optional(),
  packPriceMargin: z.string().optional(),
});

export default function ProductForm() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      greatForGift: false,
      sizes: [],
    },
  });

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    unitPrice: "",
    unitDiscount: "",
    unitPriceMargin: "",
    packSize: "",
    packPrice: "",
    packDiscount: "",
    packPriceMargin: "",
    rating: "",
    quantityOnHand: "",
    greatForGift: false,
    mainCategory: "",
    subCategory: "",
    country: "",
    region: "",
    subRegion: "",
    dryness: "",
    vintage: "",
    abv: "",
    sizes: [],
    varietal: "",
    image: null,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData((prev :any) => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const calculateUnitPrice = (packSize: string, packPrice: string) => {
    const size = parseFloat(packSize) || 0;
    const price = parseFloat(packPrice) || 0;
    return size > 0 ? (price / size).toFixed(2) : "0.00";
  };

  const calculateMargins = (cost: string, price: string) => {
    const costValue = parseFloat(cost) || 0;
    const priceValue = parseFloat(price) || 0;
    if (costValue === 0 || priceValue === 0) return "0.00";
    return (((priceValue - costValue) / priceValue) * 100).toFixed(2);
  };

  const calculateMarginPrice = (cost: string, margin: string) => {
    const costValue = parseFloat(cost) || 0;
    const marginValue = parseFloat(margin) || 0;
    return costValue / (1 - marginValue / 100);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      name: values.productName,
      description: values.description,
      unitPrice: parseFloat(values.unitPrice),
      unitDiscount: parseFloat(values.unitDiscount || "0") || 0,
      packSize: parseInt(values.packSize),
      packDiscount: parseFloat(values.packDiscount || "0") || 0,
      packPrice: parseFloat(values.packPrice),
      rating: parseInt(values.rating || "0") || 0,
      qtyOnHand: parseInt(values.quantityOnHand),
      isGreatForGift: values.greatForGift,
      categories: [values.mainCategory],
      subCategories: [values.subCategory],
      regions: [values.region],
      subRegions: [],
      dryness: values.dryness,
      country: values.country,
      vintage: values.vintage,
      abv: parseFloat(values.abv),
      sizeTypes: values.sizes,
      image: selectedImage,
      inStock: parseInt(values.quantityOnHand) > 0,
    };

    console.log("Formatted Form Data:", formattedData);
    console.log("Raw Form Data:", formData);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full p-6">
      <Button
        className="mb-3"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Enter the basic information about your product.
              </CardDescription>
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select main category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mainCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sub1">Sub Category 1</SelectItem>
                          <SelectItem value="sub2">Sub Category 2</SelectItem>
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

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="region1">Region 1</SelectItem>
                          <SelectItem value="region2">Region 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="varietal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Varietal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select varietal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="varietal1">Varietal 1</SelectItem>
                          <SelectItem value="varietal2">Varietal 2</SelectItem>
                        </SelectContent>
                      </Select>
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
                          {vintageYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
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
                          {dryness.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
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
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter rating"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Price and Discount Section */}
          <Card>
            <CardHeader>
              <CardTitle>Price and Discount</CardTitle>
              <CardDescription>
                Set your product pricing and discount information.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-3 gap-4">
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
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                          placeholder="Auto-calculated"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Auto-calculated from pack price and size
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitPriceMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price Margin (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter unit price margin"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const newPrice = calculateMarginPrice(
                              "0",
                              e.target.value
                            );
                            form.setValue("unitPrice", newPrice.toFixed(2));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packPriceMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Price Margin (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter pack price margin"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const newPrice = calculateMarginPrice(
                              "0",
                              e.target.value
                            );
                            form.setValue("packPrice", newPrice.toFixed(2));
                          }}
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Great for Gift</FormLabel>
                      <FormDescription>
                        Mark this product as an ideal gift option
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-semibold mb-2">Price Summary</h4>
                  <div className="space-y-1">
                    <p>Pack Price: ${form.watch("packPrice") || "0.00"}</p>
                    <p>Unit Price: ${form.watch("unitPrice") || "0.00"}</p>
                    <p>
                      Total Discount: $
                      {(
                        parseFloat(form.watch("packDiscount") || "0") +
                        parseFloat(form.watch("unitDiscount") || "0")
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Margins</h4>
                  <div className="space-y-1">
                    <p>
                      Pack Price Margin:{" "}
                      {calculateMargins("0", form.watch("packPrice") || "0")}%
                    </p>
                    <p>
                      Unit Price Margin:{" "}
                      {calculateMargins("0", form.watch("unitPrice") || "0")}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>Upload your product image.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                  >
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Click or drag and drop to upload image
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
