import { Link } from '../lib/router'
import { useStore } from '../lib/store'
import { fmt } from '../lib/products'
import { Button, Empty } from '../components/ui'

export default function Account() {
  const { state, logout } = useStore()
  if (!state.user) return <div className="mx-auto max-w-3xl px-4 pt-10"><Empty icon="🔒" title="Bạn chưa đăng nhập" action={<Button as={Link} to="/login" data-analytic-id="account-login-cta">Đăng nhập</Button>} /></div>
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6" data-analytic-id="account-page">
      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">{state.user.name[0]}</span>
        <div><h1 className="text-xl font-bold">{state.user.name}</h1><p className="text-sm text-slate-500">{state.user.email}</p></div>
        <Button variant="danger" onClick={logout} className="ml-auto" data-analytic-id="account-logout">Đăng xuất</Button>
      </div>
      <h2 className="mb-3 mt-8 text-lg font-bold">Đơn hàng ({state.orders.length})</h2>
      {state.orders.length === 0 ? <Empty icon="📦" title="Chưa có đơn hàng" /> : (
        <ul className="space-y-3">
          {state.orders.map((o) => (
            <li key={o.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200" data-analytic-id="order-row" data-transaction-id={o.id}>
              <div className="flex justify-between text-sm"><span className="font-mono font-semibold">{o.id}</span><span className="text-slate-500">{new Date(o.createdAt).toLocaleString('vi-VN')}</span></div>
              <div className="mt-1 text-sm text-slate-600">{o.cartItems.map((i) => `${i.product.name} ×${i.qty}`).join(', ')}</div>
              <div className="mt-2 flex items-center justify-between"><span className="font-bold">{fmt(o.total)}</span><Link to={`/order/${o.id}`} className="text-sm text-brand-600" data-analytic-id="order-detail-link">Chi tiết →</Link></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
