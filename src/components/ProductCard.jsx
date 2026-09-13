import { Link } from '../lib/router'
import { useStore } from '../lib/store'
import { track } from '../lib/analytics'
import { ProductImage, Price, Stars, Badge } from './ui'

export default function ProductCard({ product, listId, listName, index }) {
  const { addToCart, toggleWish, state } = useStore()
  const wished = state.wishlist.includes(product.id)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg"
      data-analytic-id="product-card"
      data-product-id={product.id}
      data-product-name={product.name}
      data-product-price={product.price}
      data-list-id={listId}
      data-index={index}
    >
      <Link
        to={`/product/${product.id}`}
        onClick={() => track.selectItem(product, listId, listName, index)}
        data-analytic-id="product-card-link"
        data-product-id={product.id}
        className="block"
      >
        <ProductImage product={product} className="aspect-square w-full rounded-none" />
      </Link>
      {discount > 0 && <div className="absolute left-3 top-3"><Badge color="bg-rose-500 text-white">-{discount}%</Badge></div>}
      <button
        type="button"
        onClick={() => toggleWish(product)}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110 ${wished ? 'text-rose-500' : 'text-slate-400'}`}
        aria-label="Yêu thích"
        data-analytic-id="wishlist-toggle"
        data-product-id={product.id}
      >
        {wished ? '♥' : '♡'}
      </button>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs uppercase tracking-wide text-slate-400">{product.brand}</span>
        <Link to={`/product/${product.id}`} onClick={() => track.selectItem(product, listId, listName, index)} className="mt-0.5 font-semibold text-slate-900 hover:text-brand-600 line-clamp-2">
          {product.name}
        </Link>
        <Stars value={product.rating} />
        <div className="mt-auto flex items-center justify-between pt-3">
          <Price product={product} />
          <button
            type="button"
            onClick={() => addToCart(product, product.variants[0], 1)}
            className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-600 hover:text-white"
            data-analytic-id="add-to-cart-quick"
            data-product-id={product.id}
          >
            + Giỏ
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({ products, listId, listName }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-analytic-id="product-grid" data-list-id={listId}>
      {products.map((p, i) => <ProductCard key={p.id} product={p} listId={listId} listName={listName} index={i} />)}
    </div>
  )
}
