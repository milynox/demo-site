import { useEffect, useState } from 'react'
import { findProduct, PRODUCTS, categoryName, fmt } from '../lib/products'
import { track } from '../lib/analytics'
import { useStore } from '../lib/store'
import { useRouter } from '../lib/router'
import { ProductGrid } from '../components/ProductCard'
import { Breadcrumb, Button, ProductImage, Stars, Price, Section, Empty, Badge } from '../components/ui'

export default function Product({ params }) {
  const product = findProduct(params.id)
  const { addToCart, toggleWish, state } = useStore()
  const { navigate } = useRouter()
  const [variant, setVariant] = useState(product?.variants[0])
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')

  useEffect(() => {
    if (!product) return
    setVariant(product.variants[0]); setQty(1)
    track.viewItem(product)
  }, [product])

  if (!product) return <div className="mx-auto max-w-6xl px-4 pt-10"><Empty icon="😕" title="Sản phẩm không tồn tại" /></div>

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const wished = state.wishlist.includes(product.id)
  const buyNow = () => { addToCart(product, variant, qty); navigate('/checkout') }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6" data-analytic-id="product-detail" data-product-id={product.id}>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: categoryName(product.category), to: `/category/${product.category}` }, { label: product.name }]} />
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage product={product} className="aspect-square w-full" />
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">{product.brand}</span>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3"><Stars value={product.rating} /><span className="text-xs text-slate-400">· 128 đánh giá</span></div>
          <div className="mt-4"><Price product={product} size="text-2xl" />{product.oldPrice && <Badge color="bg-rose-100 text-rose-600">Tiết kiệm {fmt(product.oldPrice - product.price)}</Badge>}</div>

          <div className="mt-6">
            <div className="mb-2 text-sm font-medium">Phân loại: <span className="text-slate-500">{variant}</span></div>
            <div className="flex flex-wrap gap-2" data-analytic-id="variant-picker">
              {product.variants.map((v) => (
                <button key={v} type="button" onClick={() => { setVariant(v); track.custom('select_variant', { item_id: product.id, item_variant: v }) }}
                  className={`min-w-11 rounded-lg px-3 py-2 text-sm font-medium ring-1 ${variant === v ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white ring-slate-200 hover:ring-slate-400'}`}
                  data-analytic-id="variant-option" data-variant={v}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-lg ring-1 ring-slate-200" data-analytic-id="qty-stepper">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-slate-100" data-analytic-id="qty-minus">−</button>
              <span className="w-10 text-center text-sm font-semibold" data-analytic-id="qty-value">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-slate-100" data-analytic-id="qty-plus">+</button>
            </div>
            <Button onClick={() => addToCart(product, variant, qty)} className="flex-1" data-analytic-id="add-to-cart" data-product-id={product.id} id="btn-add-to-cart">🛒 Thêm vào giỏ</Button>
            <Button variant="secondary" onClick={() => toggleWish(product)} data-analytic-id="wishlist-toggle" data-product-id={product.id} aria-label="Yêu thích">{wished ? '♥' : '♡'}</Button>
          </div>
          <Button variant="secondary" onClick={buyNow} className="mt-3 w-full" data-analytic-id="buy-now" data-product-id={product.id} id="btn-buy-now">⚡ Mua ngay</Button>

          <div className="mt-8 border-b border-slate-200">
            <div className="flex gap-6 text-sm font-medium" data-analytic-id="product-tabs">
              {[['desc', 'Mô tả'], ['spec', 'Thông số'], ['review', 'Đánh giá']].map(([k, l]) => (
                <button key={k} onClick={() => { setTab(k); track.custom('product_tab_view', { item_id: product.id, tab: k }) }} className={`-mb-px border-b-2 pb-2 ${tab === k ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`} data-analytic-id="product-tab" data-tab={k}>{l}</button>
              ))}
            </div>
          </div>
          <div className="pt-4 text-sm text-slate-600">
            {tab === 'desc' && <p>{product.desc}</p>}
            {tab === 'spec' && <ul className="list-inside list-disc space-y-1"><li>Mã: {product.id}</li><li>Thương hiệu: {product.brand}</li><li>Phân loại: {product.variants.join(', ')}</li></ul>}
            {tab === 'review' && <p>⭐ {product.rating}/5 từ 128 khách hàng. “Sản phẩm rất tốt, giao hàng nhanh.”</p>}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <Section title="Sản phẩm liên quan"><ProductGrid products={related} listId="pdp_related" listName="PDP – Liên quan" /></Section>
      )}
    </div>
  )
}
