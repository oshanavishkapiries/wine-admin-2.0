import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteProductMutation } from "@/features/api/productSlice";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DeletePopup = (props: any) => {
  const [deleteProduct] = useDeleteProductMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProduct(props.item.id).unwrap();
      setIsLoading(false);
      toast.success(`Product "${props.item.productName}" deleted successfully`);
    } catch (error: any) {
      toast.error(`Failed to delete the product: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product "
            {props.item.productName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePopup;
