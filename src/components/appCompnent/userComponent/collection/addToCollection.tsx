'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  useAddProductToCollection,
  useCollectionChecker,
  useCreateCollection,
  useGetAllCollection,
} from '@/lib/utils/queryFuntions'
import { Plus, Loader2, FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
export default function AddToCollection({ productId }: { productId: string }) {
  const [collection, setCollection] = useState('')
  const { data: allCollection, isLoading } = useGetAllCollection()
  const { mutate, isPending: isCreating } = useCreateCollection()
  const { mutate: AddProductToCollection, isPaused: isAdding } = useAddProductToCollection()
  const [collectionIndex, setCollectionIndex] = useState<number[]>([])

  const { data: checker } = useCollectionChecker(productId)

  const handleNewCollection = () => {
    if (collection.trim()) {
      mutate(collection.trim(), {
        onSuccess: () => setCollection(''),
      })
    }
  }

  function handleAddProductToCollection(collectionId: string) {
    AddProductToCollection(
      { productId, collectionId },
      {
        onSuccess: () => {
          toast.success('Product added successfully')
        },
      }
    )
  }

  const checkCollections = new Set(checker ? checker?.map((c) => c.collectionId) : '')

  return (
    <Card className="border-none shadow-lg rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
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
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 max-h-56 overflow-y-scroll">
        {isLoading ? (
          <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading collections...
          </div>
        ) : allCollection && allCollection.length > 0 ? (
          <AnimatePresence>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {allCollection.reverse().map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white "
                >
                  <span className="text-sm font-medium text-gray-800">{c.collectionName}</span>
                  <Button
                    disabled={collectionIndex.includes(i) || checkCollections.has(c.id)}
                    onClick={() => {
                      setCollectionIndex((prev) => [...prev, i])
                      handleAddProductToCollection(c.id)
                    }}
                    variant="outline"
                    size="sm"
                    className="border-indigo-400 text-indigo-600 hover:bg-indigo-50 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-sm text-gray-500 text-center italic">
            No collections yet. Create one to organize your favorites!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
