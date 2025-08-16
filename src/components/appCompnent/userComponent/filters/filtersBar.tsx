'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { SlidersHorizontal } from 'lucide-react'
import { useMediaQuery } from 'react-responsive'
import { useFilterParams } from './useFilters'

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
  { display: 'All License', value: 'all' },
  { display: 'Free License', value: 'freelicense' },
  { display: 'Pro License', value: 'prolicense' },
]

export function FilterBar() {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const { setFilter, getFilter } = useFilterParams()
  const activeContent = getFilter('content')

  return (
    <div className="mt-10">
      {isMobile ? (
        <div className="grid grid-cols-2 gap-2">
          <Select onValueChange={(v) => setFilter('content', v)}>
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

          <Select onValueChange={(v) => setFilter('license', v)}>
            <SelectTrigger className="w-full">
              <Image src="/license.png" alt="license icon" width={35} height={35} />
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
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex gap-5">
            {ContentOptions.map((opt) => {
              const isActive = activeContent === opt.value
              return (
                <div
                  key={opt.value}
                  onClick={() => setFilter('content', opt.value)}
                  className="group cursor-pointer"
                >
                  <h1 className="font-bold text-sm">{opt.display}</h1>
                  <div
                    className={`border-b-2 w-full h-1 translate-y-3 ${
                      isActive ? 'bg-black' : 'opacity-0 group-hover:opacity-100 bg-black'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          <Select onValueChange={(v) => setFilter('license', v)}>
            <SelectTrigger>
              <Image src="/license.png" alt="license icon" width={35} height={35} />
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
      )}
      <div className="border-b w-full h-1 mt-2" />
    </div>
  )
}
