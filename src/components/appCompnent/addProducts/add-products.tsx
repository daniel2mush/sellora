import { getSignature } from "@/app/actions/cloudinary";
import { addNewProductAction } from "@/app/actions/productAction";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { log } from "util";
import z from "zod";

export default function AddProductForm({ setOpen }: { setOpen: () => void }) {
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [assetUploadProgress, setAssetUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const closeref = useRef(null);
  // File schemas
  const ThumbnailSchema = z
    .instanceof(File)
    .refine((f) => f instanceof File && f.size > 0, "Thumbnail is required")
    .refine((f) => f.size <= 5 * 1024 * 1024, "Thumbnail must be under 5MB")
    .refine(
      (f) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type),
      "Invalid image format"
    );

  const AssetSchema = z
    .instanceof(File)
    .refine((f) => f instanceof File && f.size > 0, "Asset is required")
    .refine(
      (f) =>
        [
          "application/pdf",
          "application/zip",
          "application/x-zip-compressed",
        ].includes(f.type),
      "File must be PDF or ZIP"
    )
    .refine((f) => f.size <= 10 * 1024 * 1024, "Asset must be under 10MB");

  // Form schema
  const FormSchema = z.object({
    title: z
      .string()
      .min(10, "Title should be more than 10 characters")
      .max(122, "Title should be less than 122 characters"),
    description: z
      .string()
      .min(10, "Description should be more than 10 characters")
      .max(122, "Description should be less than 122 characters"),
    price: z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Enter a valid price (e.g. 19.99)",
    }),
    thumbnail: ThumbnailSchema,
    asset: AssetSchema,
  });

  type FormTypes = z.infer<typeof FormSchema>;

  const form = useForm<FormTypes>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
  });

  async function AddProduct(data: FormTypes) {
    setIsUploading(true);
    const parsed = {
      ...data,
      price: parseFloat(data.price),
    };

    type clodinaryTypes = {
      public_id: string;
      secure_url: string;
      bytes: number;
    };
    const thumbnail = (await UploadThumbnailToCloudinary(
      data.thumbnail
    )) as clodinaryTypes;
    const assets = (await UploadAssetToCloudinary(
      data.asset
    )) as clodinaryTypes;

    console.log(thumbnail, "Thumbnail cloudinary");
    console.log(assets, "Assets cloudinary");

    const fileType = assets.public_id.split("/").pop()?.split(".").pop();

    try {
      const DataBaseFormData = new FormData();
      DataBaseFormData.append("title", data.title);
      DataBaseFormData.append("description", data.description);
      DataBaseFormData.append("price", data.price);
      DataBaseFormData.append("thumbnailUrl", thumbnail.secure_url);
      DataBaseFormData.append("assetUrl", assets.secure_url);
      DataBaseFormData.append("publicId", assets.public_id);
      DataBaseFormData.append("assetType", fileType as string);
      DataBaseFormData.append("assetSize", assets.bytes.toString());

      const { message, status } = await addNewProductAction(DataBaseFormData);
      if (!status) {
        toast.error(message);
        return;
      }
      toast.success(message);
      setOpen();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      form.reset();
    }
  }

  async function UploadThumbnailToCloudinary(file: File) {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    const { data, status, message } = await getSignature(timestamp);

    const folder = "sellora";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("api_key", data.apiKey);
    formData.append("signature", data.signature);
    formData.append("timestamp", timestamp.toString());

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multiparts/form-data",
          },
          onUploadProgress: (e) => {
            const progress = Math.round((e.loaded * 100) / (e.total || 1));
            setThumbnailUploadProgress(progress);
          },
        }
      );

      const res = await cloudinaryRes.data;
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async function UploadAssetToCloudinary(file: File) {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    const { data, status, message } = await getSignature(timestamp);

    const folder = "sellora";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("api_key", data.apiKey);
    formData.append("signature", data.signature);
    formData.append("timestamp", timestamp.toString());

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/raw/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multiparts/form-data",
          },
          onUploadProgress: (e) => {
            const progress = Math.round((e.loaded * 100) / (e.total || 1));
            setAssetUploadProgress(progress);
          },
        }
      );

      const res = await cloudinaryRes.data;
      return res;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(AddProduct)} className="space-y-6">
        {/* Title */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your product title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Price */}
        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Thumbnail */}
        <FormField
          name="thumbnail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Asset */}
        <FormField
          name="asset"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.zip"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {assetUploadProgress > 0 && (
          <div>
            {/* Asset upload */}
            <div className=" w-full rounded overflow-hidden bg-gray-100 h-1">
              <div
                className=" bg-green-500 h-full"
                style={{
                  width: `${assetUploadProgress}%`,
                }}
              />
            </div>
            <p className=" text-sm text-gray-500 text-end">
              {" "}
              {assetUploadProgress}% upload
            </p>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className=" w-25" type="submit" disabled={isUploading}>
            {isUploading ? (
              <div className=" h-7 w-7 rounded-full border-2 border-t-transparent animate-spin " />
            ) : (
              "Add Product"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
