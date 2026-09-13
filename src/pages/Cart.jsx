import { useEffect } from 'react'
import { Link } from '../lib/router'
import { useStore, cartSubtotal, cartItemToGa } from '../lib/store'
import { track } from '../lib/analytics'
import { fmt } from '../lib/products'
import { Breadcrumb, Button, ProductImage, Empty } from '../components/ui'

export default function Cart() {
  const { state, setQty, remove } = useStore()
  const cart = state.cart
  const subtotal = cartSubtotal(cart)

  useEffect(() => { if (cart.length) track.viewCart(cart.map(cartItemToGa)) }, []) // eslint-disable-line

  if (!cart.length)
    return <div className="mx-auto max-w-6xl px-4 pt-10"><Empty title="Giỏ hàng trống" desc="Thêm vài sản phẩm rồi quay lại nhé." action={<Button as={Link} to="/category/all" data-analytic-id="cart-empty-cta">Mua sắm ngay</Button>} /></div>

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6" data-analytic-id="cart-page">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Giỏ hàng' }]} />
      <h1 className="mb-6 text-2xl font-bold">Giỏ hàng ({cart.length})</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-3">
          {cart.map((it) => (
            <li key={it.key} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200" data-analytic-id="cart-item" data-product-id={it.product.id}>
              <ProductImage product={it.product} className="h-24 w-24 shrink-0 [&>span]:text-4xl" />
              <div className="flex flex-1 flex-col">
                <Link to={`/product/${it.product.id}`} className="font-semibold hover:text-brand-600" data-analytic-id="cart-item-link">{it.product.name}</Link>
                <span className="text-xs text-slate-500">Phân loại: {it.variant}</span>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg ring-1 ring-slate-200">
                    <button onClick={() => setQty(it, it.qty - 1)} disabled={it.qty <= 1} className="px-3 py-1 hover:bg-slate-100 disabled:opacity-30" data-analytic-id="cart-qty-minus">−</button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button onClick={() => setQty(it, it.qty + 1)} className="px-3 py-1 hover:bg-slate-100" data-analytic-id="cart-qty-plus">+</button>
                  </div>
                  <span className="font-bold">{fmt(it.qty * it.product.price)}</span>
                </div>
              </div>
              <button onClick={() => remove(it)} className="self-start text-slate-400 hover:text-rose-500" aria-label="Xóa" data-analytic-id="cart-remove" data-product-id={it.product.id}>✕</button>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-slate-200" data-analytic-id="cart-summary">
          <h3 className="font-semibold">Tóm tắt</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Tạm tính</dt><dd>{fmt(subtotal)}</dd></div>
            <div className="flex justify-between text-slate-500"><dt>Phí ship</dt><dd>Tính ở bước sau</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold"><dt>Tổng</dt><dd>{fmt(subtotal)}</dd></div>
          </dl>
          <Button as={Link} to="/checkout" className="mt-5 w-full" data-analytic-id="checkout-start" id="btn-checkout">Thanh toán →</Button>
          <Link to="/category/all" className="mt-3 block text-center text-sm text-brand-600" data-analytic-id="continue-shopping">← Tiếp tục mua sắm</Link>
        </aside>
      </div>
    </div>
  )
}
