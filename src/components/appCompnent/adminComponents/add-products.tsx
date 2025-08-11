'use client'
import { getSignature } from '@/app/actions/cloudinary/cloudinary'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

type productTypes = {
  id: string
  title: string
  description: string
  price: string
  thumbnailUrl: string
}

interface AddProductProps {
  products?: productTypes
  setOpen: () => void
}

import slugify from 'slugify'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAddAdminProducts, useUpdate } from '@/lib/utils/admin/adminQueryFun'

export default function AddProductForm({ setOpen, products }: AddProductProps) {
  const { mutate } = useAddAdminProducts()

  // const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [assetUploadProgress, setAssetUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const { mutateAsync } = useUpdate()

  // File schemas
  const ThumbnailSchema = z
    .instanceof(File)
    .refine((f) => f instanceof File && f.size > 0, 'Thumbnail is required')
    .refine((f) => f.size <= 10 * 1024 * 1024, 'Thumbnail must be under 10MB')
    .refine(
      (f) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(f.type),
      'Invalid image format'
    )

  const AssetSchema = z
    .instanceof(File)
    .refine((f) => f instanceof File && f.size > 0, 'Asset is required')
    .refine(
      (f) =>
        [
          'application/pdf',
          'application/zip',
          'application/x-zip-compressed',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/avif',
        ].includes(f.type),
      'File must be PDF or ZIP'
    )
    .refine((f) => f.size <= 10 * 1024 * 1024, 'Asset must be under 10MB')

  // Form schema
  const FormSchema = z.object({
    title: z
      .string()
      .min(10, 'Title should be more than 10 characters')
      .max(122, 'Title should be less than 122 characters'),
    description: z.string().optional(),
    price: z.string().refine((val) => /^\d+\.\d{1,2}$/.test(val), {
      message: 'Enter a valid price with cents (e.g. 19.99)',
    }),
    thumbnail: ThumbnailSchema.optional(),
    asset: AssetSchema.optional(),
    category: z.enum(['psd', 'photo', 'png', 'svg', 'template', 'vector']),
  })

  type FormTypes = z.infer<typeof FormSchema>

  const form = useForm<FormTypes>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: products?.title || '',
      description: products?.description || '',
      price: products?.price ? (Number(products?.price) / 100).toFixed(2) : '',
      category: 'photo',
    },
  })

  async function AddProduct(data: FormTypes) {
    setIsUploading(true)
    const parsed = {
      ...data,
      price: Math.round(parseFloat(data.price) * 100),
    }

    type clodinaryTypes = {
      public_id: string
      secure_url: string
      bytes: number
    }
    const thumbnail = (await UploadThumbnailToCloudinary(
      data.thumbnail!,
      data.title
    )) as clodinaryTypes
    const assets = (await UploadAssetToCloudinary(data.asset!, data.title)) as clodinaryTypes

    console.log(assets, 'Cloudinary response')

    try {
      if (assets) {
        const fileType = assets.public_id.split('/').pop()?.split('.').pop()

        const DataBaseFormData = new FormData()
        DataBaseFormData.append('title', data.title)
        DataBaseFormData.append('description', data.description || '')
        DataBaseFormData.append('price', parsed.price.toString())
        DataBaseFormData.append('thumbnailUrl', thumbnail.secure_url)
        DataBaseFormData.append('assetUrl', assets.secure_url)
        DataBaseFormData.append('publicId', assets.public_id)
        DataBaseFormData.append('assetType', fileType as string)
        DataBaseFormData.append('assetSize', assets.bytes.toString())
        DataBaseFormData.append('category', data.category)

        // const { message, success } = await addNewProductAction(
        //   DataBaseFormData
        // );

        // if (success) {
        //   setOpen();
        //   return;
        // }
        // toast.error(message);

        mutate(DataBaseFormData)

        setOpen()
        toast.success('Product added successfully')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUploading(false)
      form.reset()
    }
  }

  async function UpdateProducts(data: FormTypes) {
    setIsUploading(true)
    const parsed = {
      ...data,
      price: Math.round(parseFloat(data.price) * 100),
    }
    type clodinaryTypes = {
      public_id: string
      secure_url: string
      bytes: number
    }
    const thumbnail = (await UploadThumbnailToCloudinary(
      data.thumbnail!,
      data.title
    )) as clodinaryTypes

    try {
      const { success, message } = await mutateAsync({
        productId: products?.id as string,
        title: data.title,
        description: data.description,
        price: parsed.price,
        thumbnailUrl: thumbnail.secure_url,
      })

      if (success) {
        toast.success(message)
        return
      }
      toast.error(message)
    } catch (error) {
      console.log(error)
    } finally {
      setOpen()
      form.reset()
    }
  }

  async function UploadThumbnailToCloudinary(file: File, title: string) {
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    const public_id = `${slugify(title, {
      strict: true,
      trim: true,
      lower: true,
    })}-${Date.now()}`
    const { data } = await getSignature(timestamp, public_id)

    const folder = 'sellora'
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('api_key', data.apiKey)
    formData.append('signature', data.signature)
    formData.append('timestamp', timestamp.toString())
    formData.append('public_id', public_id)

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const res = await cloudinaryRes.data
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async function UploadAssetToCloudinary(file: File, title: string) {
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    const public_id = `${slugify(title, {
      strict: true,
      trim: true,
      lower: true,
    })}-${Date.now()}`
    const { data } = await getSignature(timestamp, public_id)

    const folder = 'sellora'
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('api_key', data.apiKey)
    formData.append('signature', data.signature)
    formData.append('timestamp', timestamp.toString())
    formData.append('public_id', public_id)

    try {
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/raw/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            const progress = Math.round((e.loaded * 100) / (e.total || 1))
            setAssetUploadProgress(progress)
          },
        }
      )

      const res = await cloudinaryRes.data
      return res
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(products ? UpdateProducts : AddProduct)}
        className="space-y-6"
      >
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
                <Input type="text" step={'.01'} placeholder="Enter price" {...field} />
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
                    const file = e.target.files?.[0]
                    if (file) field.onChange(file)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Asset category here */}
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder=" Select an asset category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="psd">PSD</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="png">Png</SelectItem>
                  <SelectItem value="svg">Svg</SelectItem>
                  <SelectItem value="vector">Vector</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Asset */}

        {!products && (
          <FormField
            name="asset"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.zip,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) field.onChange(file)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
            <p className=" text-sm text-gray-500 text-end"> {assetUploadProgress}% upload</p>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className=" " type="submit" disabled={isUploading}>
            {isUploading ? (
              <div className=" h-7 w-7 rounded-full border-2 border-t-transparent animate-spin " />
            ) : products ? (
              'Update Product'
            ) : (
              'Add Product'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
