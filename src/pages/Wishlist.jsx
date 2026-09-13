import { useEffect } from 'react'
import { Link } from '../lib/router'
import { useStore } from '../lib/store'
import { PRODUCTS } from '../lib/products'
import { track } from '../lib/analytics'
import { ProductGrid } from '../components/ProductCard'
import { Button, Empty, Breadcrumb } from '../components/ui'

export default function Wishlist() {
  const { state } = useStore()
  const products = PRODUCTS.filter((p) => state.wishlist.includes(p.id))
  useEffect(() => { if (products.length) track.viewItemList(products, 'wishlist', 'Wishlist') }, [products.length]) // eslint-disable-line
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Yêu thích' }]} />
      <h1 className="mb-6 text-2xl font-bold">Yêu thích ({products.length})</h1>
      {products.length ? <ProductGrid products={products} listId="wishlist" listName="Wishlist" /> : <Empty icon="♡" title="Chưa có sản phẩm yêu thích" action={<Button as={Link} to="/category/all">Khám phá</Button>} />}
    </div>
  )
}
