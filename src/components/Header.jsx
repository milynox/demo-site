import { useState } from 'react'
import { Link, useRouter } from '../lib/router'
import { useStore, cartCount } from '../lib/store'
import { CATEGORIES } from '../lib/products'
import { track } from '../lib/analytics'

export default function Header() {
  const { state, logout } = useStore()
  const { navigate, path } = useRouter()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const count = cartCount(state.cart)

  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    track.search(term)
    navigate(`/search?q=${encodeURIComponent(term)}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur" id="site-header">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-brand-700" data-analytic-id="nav-logo">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">S</span> ShopDemo
        </Link>

        <nav className="hidden items-center gap-1 md:flex" data-analytic-id="nav-main">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              data-analytic-id="nav-category"
              data-category={c.id}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-100 ${path === `/category/${c.id}` ? 'text-brand-600' : 'text-slate-600'}`}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden flex-1 max-w-sm md:block" role="search" data-analytic-id="search-form">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm…"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:bg-white"
            data-analytic-id="search-input"
            name="q"
          />
        </form>

        <div className="flex items-center gap-1 md:ml-0 ml-auto">
          <Link to="/wishlist" className="relative rounded-lg p-2 hover:bg-slate-100" aria-label="Yêu thích" data-analytic-id="nav-wishlist">
            ♡{state.wishlist.length > 0 && <Dot n={state.wishlist.length} />}
          </Link>
          <Link to="/cart" className="relative rounded-lg p-2 hover:bg-slate-100" aria-label="Giỏ hàng" data-analytic-id="nav-cart" id="cart-icon">
            🛒{count > 0 && <Dot n={count} />}
          </Link>
          {state.user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-100" data-analytic-id="nav-account">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{state.user.name[0]}</span>
                <span className="hidden sm:inline">{state.user.name}</span>
              </button>
              <div className="invisible absolute right-0 mt-1 w-44 rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200 group-hover:visible">
                <Link to="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50" data-analytic-id="nav-account-orders">Đơn hàng của tôi</Link>
                <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50" data-analytic-id="nav-logout">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700" data-analytic-id="nav-login">Đăng nhập</Link>
          )}
          <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" data-analytic-id="nav-mobile-toggle">☰</button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm…" className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm" data-analytic-id="search-input-mobile" />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/category/${c.id}`} onClick={() => setOpen(false)} className="rounded-lg bg-slate-50 px-3 py-2 text-sm" data-analytic-id="nav-category-mobile" data-category={c.id}>
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

const Dot = ({ n }) => (
  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{n}</span>
)
