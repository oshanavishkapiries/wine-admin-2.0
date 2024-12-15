import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAProductQuery } from "@/features/api/productSlice";
import { Eye } from "lucide-react";

const ViewPopup = (props: any) => {
  const { data: product } = useGetAProductQuery(props.item.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye /> View Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{product?.data?.name || "No Product Name"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 py-4">
          {/* Image Section */}
          <div className="flex justify-center items-start flex-shrink-0">
            <img
              src={product?.data?.image || "/placeholder-image.png"}
              alt={product?.data?.name || "Product Image"}
              className="w-full max-w-[300px] h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Text Content Section */}
          <div className="flex flex-col gap-4 flex-grow">
            <DialogDescription>
              {product?.data?.description || "No description available."}
            </DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Unit Price:</strong> $
                {product?.data?.unitPrice?.toFixed(2) || "N/A"}
              </div>
              <div>
                <strong>Pack Price:</strong> $
                {product?.data?.packPrice?.toFixed(2) || "N/A"}
              </div>
              <div>
                <strong>Rating:</strong> {product?.data?.rating || "N/A"}
              </div>
              <div>
                <strong>Quantity on Hand:</strong>{" "}
                {product?.data?.qtyOnHand || "N/A"}
              </div>
              <div>
                <strong>Country:</strong> {product?.data?.country || "N/A"}
              </div>
              <div>
                <strong>ABV:</strong> {product?.data?.abv || "N/A"}%
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="grid gap-4 py-4">
          <div>
            <strong>Categories:</strong>
            <ul>
              {product?.data?.categories?.length ? (
                product?.data?.categories.map((category: any) => (
                  <li key={category._id}>{category.name}</li>
                ))
              ) : (
                <li>No categories available.</li>
              )}
            </ul>
          </div>
          <div>
            <strong>Regions:</strong>
            <ul>
              {product?.data?.regions?.length ? (
                product?.data?.regions.map((region: any) => (
                  <li key={region._id}>{region.region}</li>
                ))
              ) : (
                <li>No regions available.</li>
              )}
            </ul>
          </div>
          <div>
            <strong>Vintage:</strong> {product?.data?.vintage?.year || "N/A"} -
            {product?.data?.vintage?.description || "No description available."}
          </div>
          <div>
            <strong>Dryness:</strong> {product?.data?.dryness?.name || "N/A"}
          </div>
          <div>
            <strong>Size Types:</strong>
            <ul>
              {product?.data?.sizeTypes?.length ? (
                product?.data?.sizeTypes.map((sizeType: any) => (
                  <li key={sizeType._id}>{sizeType.name}</li>
                ))
              ) : (
                <li>No size types available.</li>
              )}
            </ul>
          </div>
          <div>
            <strong>Collectables:</strong>
            <ul>
              {product?.data?.collectables?.length ? (
                product?.data?.collectables.map((collectable: any) => (
                  <li key={collectable._id}>
                    {collectable.name} - {collectable.description}
                  </li>
                ))
              ) : (
                <li>No collectables available.</li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPopup;
