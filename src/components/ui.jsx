import { Link } from '../lib/router'
import { fmt } from '../lib/products'

export function Button({ children, variant = 'primary', className = '', as: Tag = 'button', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  }
  return <Tag className={`${base} ${styles[variant]} ${className}`} {...rest}>{children}</Tag>
}

export function Input({ label, id, error, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>}
      <input
        id={id}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${error ? 'border-rose-400' : 'border-slate-200'}`}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  )
}

export function Badge({ children, color = 'bg-brand-100 text-brand-700' }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{children}</span>
}

// Ảnh sản phẩm giả lập bằng màu + emoji để không cần asset.
export function ProductImage({ product, className = '' }) {
  const icon = { ao: '👕', quan: '👖', giay: '👟', 'phu-kien': '🧢' }[product.category]
  return (
    <div className={`flex items-center justify-center rounded-xl ${className}`} style={{ background: `linear-gradient(135deg, ${product.color}22, ${product.color}66)` }}>
      <span className="text-6xl drop-shadow-sm select-none">{icon}</span>
    </div>
  )
}

export function Stars({ value }) {
  return (
    <span className="text-amber-400 text-sm" aria-label={`${value} sao`}>
      {'★'.repeat(Math.round(value))}<span className="text-slate-300">{'★'.repeat(5 - Math.round(value))}</span>
      <span className="ml-1 text-xs text-slate-500">{value}</span>
    </span>
  )
}

export function Price({ product, size = 'text-base' }) {
  return (
    <div className={`flex items-baseline gap-2 ${size}`}>
      <span className="font-bold text-slate-900">{fmt(product.price)}</span>
      {product.oldPrice && <span className="text-xs text-slate-400 line-through">{fmt(product.oldPrice)}</span>}
    </div>
  )
}

export function Breadcrumb({ items }) {
  return (
    <nav className="mb-4 text-xs text-slate-500" aria-label="breadcrumb" data-analytic-id="breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">/</span>}
          {it.to ? <Link to={it.to} className="hover:text-brand-600">{it.label}</Link> : <span className="text-slate-800">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function Section({ title, action, children, id }) {
  return (
    <section className="mt-10" id={id}>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Empty({ icon = '🛒', title, desc, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
