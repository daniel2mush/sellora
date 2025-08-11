import { SetUserToAdminActions } from "@/app/actions/userActions/userActions";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { toast } from "sonner";

export function BecomeSellerDialog({
  userId,
  open,
  setOpen,
}: {
  userId: string;
  open: boolean;
  setOpen: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBecomeSeller = async () => {
    setIsLoading(true);
    try {
      const { message, status } = await SetUserToAdminActions(userId);
      if (status) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating your status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Become a Seller?</AlertDialogTitle>
          <AlertDialogDescription>
            As a seller, you can list your products for sale. Note: You may not
            be able to purchase or view products from other sellers in this
            mode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBecomeSeller} disabled={isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
