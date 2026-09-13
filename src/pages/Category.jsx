import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS, CATEGORIES, categoryName } from '../lib/products'
import { track } from '../lib/analytics'
import { ProductGrid } from '../components/ProductCard'
import { Breadcrumb, Empty } from '../components/ui'
import { Link } from '../lib/router'

const SORTS = { popular: ['Phổ biến', (a, b) => b.rating - a.rating], asc: ['Giá tăng dần', (a, b) => a.price - b.price], desc: ['Giá giảm dần', (a, b) => b.price - a.price] }

export default function Category({ params }) {
  const catId = params.id
  const isAll = catId === 'all'
  const [sort, setSort] = useState('popular')
  const [brand, setBrand] = useState('')
  const name = isAll ? 'Tất cả sản phẩm' : categoryName(catId)

  const products = useMemo(
    () => PRODUCTS.filter((p) => (isAll || p.category === catId) && (!brand || p.brand === brand)).sort(SORTS[sort][1]),
    [catId, isAll, brand, sort],
  )
  const brands = [...new Set(PRODUCTS.filter((p) => isAll || p.category === catId).map((p) => p.brand))]
  const listId = `category_${catId}`

  useEffect(() => { track.viewItemList(products, listId, name) }, [products, listId, name])

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: name }]} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{name} <span className="text-base font-normal text-slate-400">({products.length})</span></h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <select value={brand} onChange={(e) => { setBrand(e.target.value); track.custom('filter_apply', { filter_type: 'brand', filter_value: e.target.value || 'all' }) }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" data-analytic-id="filter-brand">
            <option value="">Tất cả thương hiệu</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); track.custom('sort_change', { sort_by: e.target.value }) }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" data-analytic-id="sort-select">
            {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto" data-analytic-id="category-chips">
        {[{ id: 'all', name: 'Tất cả' }, ...CATEGORIES].map((c) => (
          <Link key={c.id} to={`/category/${c.id}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${catId === c.id ? 'bg-slate-900 text-white' : 'bg-white ring-1 ring-slate-200 hover:bg-slate-100'}`}
            data-analytic-id="category-chip" data-category={c.id}>
            {c.name}
          </Link>
        ))}
      </div>
      {products.length ? <ProductGrid products={products} listId={listId} listName={name} /> : <Empty icon="🔍" title="Không có sản phẩm" />}
    </div>
  )
}
