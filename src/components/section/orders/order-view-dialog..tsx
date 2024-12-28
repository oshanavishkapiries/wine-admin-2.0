"use client";

import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Orders } from "./columns";
import { toast } from "sonner";
import {
  useGetAllOrdersQuery,
  useOrderStatusMutation,
  useUpdateOrderMutation,
} from "@/features/api/orderSlice.ts";
import { useGetAllProductsQuery } from "@/features/api/productSlice.ts";

interface OrderViewDialogProps {
  order: Orders | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderViewDialog({
  order,
  open,
  onOpenChange,
}: OrderViewDialogProps) {
  const [products, setProducts] = useState<
    Array<{ product: any; quantity: number }>
  >([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus] = useOrderStatusMutation();
  const { refetch } = useGetAllOrdersQuery({
    page: 1,
    limit: 10,
  });
  const { data: allProducts = [] } = useGetAllProductsQuery({
    page: 1,
    limit: 100,
  });
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  useEffect(() => {
    if (order) setProducts([...order.products]);
  }, [order]);

  if (!order) return null;

  const handleQuantityChange = (index: number, change: number) => {
    setProducts((prevProducts) => {
      // Validate index
      if (index < 0 || index >= prevProducts.length) {
        toast.error("Invalid product index");
        return prevProducts;
      }

      const newProducts = [...prevProducts];
      const currentProduct = { ...newProducts[index] }; // Clone the product to maintain immutability

      const currentQuantity = currentProduct.quantity || 0;
      const newQuantity = currentQuantity + change;

      if (newQuantity > currentProduct?.product?.qtyOnHand) {
        toast.error("Quantity exceeds available stock");
        return prevProducts;
      }

      if (newQuantity > 0) {
        currentProduct.quantity = newQuantity;
        newProducts[index] = currentProduct; // Replace the product with the updated one
      } else {
        toast.error("Can't set quantity to zero or below");
        return prevProducts;
      }
      return newProducts;
    });
  };

  const handelAddNewProduct = (value: any) => {
    const product = allProducts.find((product: any) => product.name === value);

    if (!product) {
      toast.error("Product not found");
      return;
    }

    // check product already exist
    const productExists = products.some(
      (item: any) => item.product._id === product._id
    );
    if (productExists) {
      toast.error("Product already added");
      return;
    }

    const newProduct = {
      product: product,
      quantity: 1,
    };
    setProducts([...products, newProduct]);
  };

  const handleDelete = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handelClose = (data: boolean = false) => {
    refetch();
    onOpenChange(data);
  };

  const handleSave = async () => {
    const updatedData = { ...order, products };
    try {
      const response = await updateOrder({
        orderId: order?._id,
        updates: updatedData,
      }).unwrap();
      if (response) {
        toast.success("Order updated successfully");
        handelClose();
      }
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const handelChangeOrderStatus = (status: string) => {
    orderStatus({ orderId: order?._id, data: { status } })
      .unwrap()
      .then(() => {
        toast.success("Order status updated successfully");
        // refetch();
      })
      .catch((error) => {
        toast.error(`Failed to update order status: ${error.message}`);
      });
  };

  return (
    <Dialog open={open} onOpenChange={handelClose}>
      <DialogContent className="max-w-md">
        {/*<DialogHeader>*/}
        {/*    <div className="flex items-center justify-between">*/}
        {/*        <DialogTitle>Order Details</DialogTitle>*/}
        {/*        <Button*/}
        {/*            variant="ghost"*/}
        {/*            size="icon"*/}
        {/*            className="h-6 w-6 rounded-full"*/}
        {/*            onClick={() => onOpenChange(false)}*/}
        {/*        >*/}
        {/*            <X className="h-4 w-4" />*/}
        {/*            <span className="sr-only">Close</span>*/}
        {/*        </Button>*/}
        {/*    </div>*/}
        {/*</DialogHeader>*/}

        <div className="space-y-4">
          <div className="text-lg">
            <span className="font-black">Order Details</span>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">User Name: </span>
              {order.user.fullName}
            </div>
            <div className="text-sm">
              <span className="font-medium">User Email: </span>
              {order.user.email || "N/A"}
            </div>
            <div className="text-sm">
              <span className="font-medium">Order status: </span>
              {order.status || "N/A"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status:</label>
            <Select
              onValueChange={(value) => {
                handelChangeOrderStatus(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Change Order Status" />
              </SelectTrigger>
              <SelectContent>
                {["pending", "delivered", "cancelled"].map((status) => (
                  <SelectItem
                    key={status}
                    defaultValue={"pending"}
                    value={status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 relative">
            <Input
              placeholder="Search product"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenSelect(true);
              }}
              onClick={() => setOpenSelect(true)}
              className="w-full absolute z-10"
            />
            <Select
              open={openSelect}
              onOpenChange={(open) => {
                setOpenSelect(open);
              }}
              onValueChange={(value) => {
                handelAddNewProduct(value);
                setSearchQuery(value);
              }}
            >
              <SelectTrigger className="opacity-0">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {allProducts
                  .filter((product) =>
                    product?.name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((product) => (
                    <SelectItem key={product?._id} value={product?.name}>
                      {product?.name}
                    </SelectItem>
                  ))
                  .concat(
                    searchQuery.length > 0 &&
                      !allProducts.some((product) =>
                        product?.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      ) ? (
                      <SelectItem key="not-found" value="not-found" disabled>
                        Product not found
                      </SelectItem>
                    ) : (
                      []
                    )
                  )}
              </SelectContent>
            </Select>
          </div>

          {order?.editable ? (
            <div className="space-y-2">
              {products.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span className="text-sm">
                    {product?.product?.name || `Product ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {product.quantity || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-6 px-2 text-sm font-normal text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span className="text-sm">
                    {product?.product?.name || `Product ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-center text-sm">
                      {product.quantity || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => handelClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isUpdating ? "Loading..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
