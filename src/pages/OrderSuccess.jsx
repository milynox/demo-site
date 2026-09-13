import { Link } from '../lib/router'
import { useStore } from '../lib/store'
import { fmt } from '../lib/products'
import { Button, Empty } from '../components/ui'

export default function OrderSuccess({ params }) {
  const { state } = useStore()
  const order = state.orders.find((o) => o.id === params.id)
  if (!order) return <div className="mx-auto max-w-3xl px-4 pt-10"><Empty icon="📦" title="Không tìm thấy đơn hàng" /></div>

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10" data-analytic-id="order-success" data-transaction-id={order.id}>
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-slate-200">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold">Đặt hàng thành công!</h1>
        <p className="mt-1 text-slate-500">Mã đơn hàng <span className="font-mono font-semibold text-slate-800">{order.id}</span></p>
        <ul className="mx-auto mt-6 max-w-md divide-y divide-slate-100 text-left text-sm">
          {order.cartItems.map((it) => <li key={it.key} className="flex justify-between py-2"><span>{it.product.name} ({it.variant}) ×{it.qty}</span><span>{fmt(it.qty * it.product.price)}</span></li>)}
          <li className="flex justify-between py-2 font-bold"><span>Tổng thanh toán</span><span>{fmt(order.total)}</span></li>
        </ul>
        <div className="mt-8 flex justify-center gap-3">
          <Button as={Link} to="/" data-analytic-id="order-continue">Tiếp tục mua sắm</Button>
          <Button as={Link} to="/account" variant="secondary" data-analytic-id="order-view-account">Xem đơn hàng</Button>
        </div>
      </div>
    </div>
  )
}
