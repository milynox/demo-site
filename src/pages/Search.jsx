import { useEffect, useMemo } from 'react'
import { PRODUCTS } from '../lib/products'
import { track } from '../lib/analytics'
import { ProductGrid } from '../components/ProductCard'
import { Breadcrumb, Empty, Button } from '../components/ui'
import { Link } from '../lib/router'

export default function Search({ query }) {
  const q = (query.get('q') || '').trim()
  const results = useMemo(() => {
    const t = q.toLowerCase()
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t))
  }, [q])

  useEffect(() => {
    track.custom('view_search_results', { search_term: q, results_count: results.length })
    if (results.length) track.viewItemList(results, 'search_results', `Search: ${q}`)
  }, [q, results])

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tìm kiếm' }]} />
      <h1 className="mb-6 text-2xl font-bold">Kết quả cho “{q}” <span className="text-base font-normal text-slate-400">({results.length})</span></h1>
      {results.length ? (
        <ProductGrid products={results} listId="search_results" listName={`Search: ${q}`} />
      ) : (
        <Empty icon="🔍" title="Không tìm thấy sản phẩm" desc="Thử từ khóa khác như “áo”, “giày”, “Moveo”." action={<Button as={Link} to="/category/all" data-analytic-id="search-empty-cta">Xem tất cả sản phẩm</Button>} />
      )}
    </div>
  )
}
