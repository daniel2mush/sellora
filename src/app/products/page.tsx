import { UserProducts } from '@/components/appCompnent/userComponent/products/productPage'
import ProductHeader from '@/components/appCompnent/userComponent/products/product-header/productHeader'
import { Metadata } from 'next'

export default async function Products() {
  return (
    <div>
      <ProductHeader />
      <UserProducts />
    </div>
  )
}
