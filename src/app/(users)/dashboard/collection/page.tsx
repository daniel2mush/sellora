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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CollectionsWithCount } from '@/lib/types/collectionTypes'
import {
  useCreateCollection,
  useDeleteCollection,
  useEditCollection,
  useGetCollectionWithProducts,
} from '@/lib/utils/queryFuntions'
import { EllipsisVertical, Folder, FolderPlus, Loader2, PenBox, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Collections() {
  const { data, isLoading } = useGetCollectionWithProducts()
  const [open, setOpen] = useState(false)

  if (isLoading) return <CollectionSkeleton />

  return (
    <div className=" w-full max-w-6xl mx-auto my-10 px-10">
      {/* Title with Add new collection button */}
      <div className=" flex justify-between items-center">
        <h1 className=" font-bold text-xl md:text-2xl">My Collections</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className=" bg-indigo-600">
              <Plus />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className=" sr-only">Add new collection</DialogTitle>
            <AddNewCollection setOpen={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Collection Grids */}

      {data!.collectionsWithCounts.length <= 0 && (
        <div className=" flex justify-center items-center min-h-[60vh] font-medium text-gray-500">
          No Collection. Add new collection
        </div>
      )}
      <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10 ">
        {data!.collectionsWithCounts.map((c, i) => (
          <CollectionCard key={i} c={c} />
        ))}
      </div>
    </div>
  )
}

function CollectionSkeleton() {
  return (
    <div className=" max-w-6xl mt-10 w-full mx-auto my-10">
      <div className=" flex justify-between items-center">
        <Skeleton className=" h-10 w-40 animate-shimmer bg-gray-200" />
        <Skeleton className=" h-10 w-60 animate-shimmer bg-gray-200" />
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        {[...Array(10)].map((i, k) => (
          <div key={k}>
            <Skeleton className=" container aspect-square  animate-shimmer bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

function CollectionCard({ c }: { c: CollectionsWithCount }) {
  const { mutate: editCollection, isPending } = useEditCollection()
  const { mutate: deleteCollection } = useDeleteCollection()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)

  const [collectionName, setCollectionName] = useState('')

  function handleSave(collectionId: string) {
    if (collectionName.trim()) {
      editCollection(
        { collectionId, collectionName },
        {
          onSuccess: () => {
            setOpen(false)
            setEditOpen(false)
            setCollectionName('')
          },
        }
      )
    }
  }

  function handleDelete() {
    deleteCollection(
      { collectionId: c.collectionId },
      {
        onSuccess: () => {
          setOpen(false)
          setEditOpen(false)
        },
      }
    )
  }

  return (
    <div className=" relative">
      <Link href={`/dashboard/collection/${c.collectionId}`}>
        <div className="  group flex justify-center items-center aspect-square border bg-indigo-50 rounded hover:border-indigo-400 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer">
          <div className=" flex flex-col items-center">
            <Folder
              size={100}
              strokeWidth={1}
              className=" group-hover:scale-125 text-indigo-400 group-hover:text-indigo-500 transition-all duration-300 ease-in-out"
            />
            <h1 className="  font-bold text-indigo-400 group-hover:text-indigo-500">
              {c.collectionName}
            </h1>
            <p className=" text-sm mt-5">{c.productCount} Items</p>
          </div>
        </div>
      </Link>
      {/* More options */}
      <div className=" absolute top-2 right-2 z-40">
        <DropdownMenu
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) setEditOpen(false)
          }}
        >
          {' '}
          <DropdownMenuTrigger
            onClick={(e) => {
              e.preventDefault()
              setEditOpen(false)
            }}
            asChild
          >
            <Button variant={'ghost'} size={'icon'} className=" cursor-pointer">
              <EllipsisVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {editOpen ? (
              <DropdownMenuGroup>
                <div className=" flex justify-between items-center gap-3 p-2">
                  <Input
                    placeholder="Collection name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                  />
                  <Button
                    className=" bg-indigo-500"
                    disabled={isPending}
                    onClick={() => handleSave(c.collectionId)}
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save
                  </Button>
                </div>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    setEditOpen(true)
                  }}
                >
                  <PenBox /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setAlertDialogOpen(true)}
                  className=" text-red-600 "
                >
                  <Trash2 className=" text-red-600" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone, This will permanently delete the collection and
              it&apos;s content
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function AddNewCollection({ setOpen }: { setOpen: () => void }) {
  const [collection, setCollection] = useState('')
  const { mutate, isPending: isCreating } = useCreateCollection()

  const handleNewCollection = () => {
    if (collection.trim()) {
      mutate(collection.trim(), {
        onSuccess: () => {
          setCollection('')
          setOpen()
        },
      })
    }
  }
  return (
    <CardHeader className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <FolderPlus className="w-5 h-5 text-indigo-600" />
        Add to Collection
      </CardTitle>

      <div className="flex gap-2 items-center w-full">
        <Input
          placeholder="Enter a collection name"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          className="flex-1 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all"
        />
        <Button
          onClick={handleNewCollection}
          disabled={!collection.trim() || isCreating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
        >
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </Button>
      </div>
    </CardHeader>
  )
}
