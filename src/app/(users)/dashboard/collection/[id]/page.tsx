'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useGetCollectionWithProducts, useRemoveFromCollection } from '@/lib/utils/queryFuntions'
import { Folder, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function CollectionDetails() {
  const params = useParams()
  const { id } = params

  const { data } = useGetCollectionWithProducts(id?.toString())
  const { mutate } = useRemoveFromCollection()

  if (!data) return
  const collectionName = data.collectionsWithCounts[0].collectionName
  return (
    <div className=" max-w-7xl mx-auto py-10 px-10">
      <h1 className=" font-bold text-xl md:text-3xl flex items-center gap-4">
        <Folder size={30} />
        {collectionName}
      </h1>
      <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 mt-10">
        {data?.productsInCollection.toReversed().map((c) => (
          <div
            key={c.productId}
            className=" relative overflow-hidden border-2 group hover:border-indigo-400 shadow hover:shadow-2xl rounded-2xl "
          >
            <Link href={`/products/${c.productId}`}>
              <div className=" relative aspect-square shadow w-full">
                <Image
                  src={c.thumbnail!}
                  alt={c.name}
                  fill
                  className=" object-cover group-hover:scale-110 transition-all duration-300 ease-in-out  "
                />
              </div>
            </Link>
            <div className=" absolute top-1 right-1 ">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size={'icon'} className=" bg-red-500 rounded-full cursor-pointer">
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone, This will permanently deleted from the
                      collection
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        mutate(
                          { collectionId: id!.toString(), productId: c.productId },
                          {
                            onSuccess: () => {
                              toast.success('Product deleted successfully')
                            },
                          }
                        )
                      }
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
