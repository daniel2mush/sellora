'use client'

import { Label } from '@/components/ui/label'
import { Settings2, Globe, Star, SlidersHorizontal } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const ContentOptions = [
  { display: 'All Images', value: 'all' },
  { display: 'Photos', value: 'photo' },
  { display: 'PNG', value: 'png' },
  { display: 'PSD', value: 'psd' },
  { display: 'SVG', value: 'svg' },
  { display: 'Vector', value: 'vector' },

  { display: 'Templates', value: 'template' },
]

const LicenseOptions = [
  { display: 'All', value: 'all', icon: <Globe className="w-4 h-4" /> },
  {
    display: 'Free License',
    value: 'freelicense',
    icon: <Star className="w-4 h-4 text-yellow-500" />,
  },
  {
    display: 'Pro License',
    value: 'prolicense',
    icon: <Settings2 className="w-4 h-4 text-blue-500" />,
  },
]

export default function ProductFilters({ setOpenFilter }: { setOpenFilter: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const contentType = searchParams.get('content') || ''

  const handleFilterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.set('page', '1') // Reset to page 1 on filter change
    if (value) {
      currentParams.set(key, value)
    } else {
      currentParams.delete(key)
    }
    setOpenFilter()
    router.push(`?${currentParams.toString()}`)
  }

  return (
    <div className="bg-white pt-5  mx-auto">
      <div className="space-y-6">
        {/* Content Section */}
        {isMobile ? (
          <div className="grid grid-cols-2 gap-2">
            <Select onValueChange={(v) => handleFilterChange('content', v)}>
              <SelectTrigger className="w-full">
                <SlidersHorizontal />
                <SelectValue placeholder="Filters" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ContentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.display}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div>
              <Select onValueChange={(v) => handleFilterChange('license', v)}>
                <SelectTrigger className="w-full">
                  <Image
                    src="https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276954/license_nmcngm.png"
                    alt="license icon"
                    width={35}
                    height={35}
                  />
                  <SelectValue placeholder="License" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LicenseOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.display}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className=" flex items-center gap-3">
              {ContentOptions.map((option) => (
                <Button
                  onClick={() => handleFilterChange('content', option.value)}
                  value={option.value}
                  variant={'ghost'}
                  key={option.value}
                  className={cn(
                    'flex items-center rounded-md hover:bg-gray-100 transition-colors',
                    contentType === option.value && 'bg-gray-100'
                  )}
                >
                  <Label className="text-gray-700 cursor-pointer" htmlFor={option.value}>
                    {option.display}
                  </Label>
                </Button>
              ))}
            </div>

            {/* License Section */}
            <div>
              <Select onValueChange={(v) => handleFilterChange('license', v)}>
                <SelectTrigger className="w-full">
                  <Image
                    src="https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276954/license_nmcngm.png"
                    alt="license icon"
                    width={35}
                    height={35}
                  />
                  <SelectValue placeholder="License" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LicenseOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.display}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
