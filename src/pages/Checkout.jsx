import { useEffect, useMemo, useState } from 'react'
import { Link, useRouter } from '../lib/router'
import { useStore, cartSubtotal, cartItemToGa } from '../lib/store'
import { track } from '../lib/analytics'
import { fmt, COUPONS, SHIPPING } from '../lib/products'
import { Button, Input, Empty } from '../components/ui'

const STEPS = ['Thông tin', 'Vận chuyển', 'Thanh toán', 'Xác nhận']

export default function Checkout() {
  const { state, clearCart, addOrder, notify } = useStore()
  const { navigate } = useRouter()
  const cart = state.cart
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: state.user?.name ?? '', email: state.user?.email ?? '', phone: '', address: '', city: 'Hồ Chí Minh' })
  const [errors, setErrors] = useState({})
  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment] = useState('cod')
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState('')
  const [placing, setPlacing] = useState(false)

  const gaItems = useMemo(() => cart.map(cartItemToGa), [cart])
  const subtotal = cartSubtotal(cart)
  const discount = Math.round(subtotal * (COUPONS[coupon] ?? 0))
  const shippingFee = coupon === 'FREESHIP' ? 0 : SHIPPING[shipping].fee
  const tax = Math.round((subtotal - discount) * 0.08)
  const total = subtotal - discount + shippingFee + tax

  useEffect(() => { if (cart.length) track.beginCheckout(gaItems) }, []) // eslint-disable-line
  useEffect(() => { track.custom('checkout_progress', { checkout_step: step + 1, checkout_step_name: STEPS[step] }) }, [step])

  if (!cart.length && !placing)
    return <div className="mx-auto max-w-6xl px-4 pt-10"><Empty title="Chưa có gì để thanh toán" action={<Button as={Link} to="/category/all">Mua sắm ngay</Button>} /></div>

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const validate = () => {
    const er = {}
    if (!form.name) er.name = 'Nhập họ tên'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Email không hợp lệ'
    if (!/^\d{9,11}$/.test(form.phone)) er.phone = 'SĐT 9-11 số'
    if (!form.address) er.address = 'Nhập địa chỉ'
    setErrors(er)
    if (Object.keys(er).length) track.custom('form_error', { form_id: 'checkout_info', fields: Object.keys(er).join(',') })
    return !Object.keys(er).length
  }

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    const ok = code in COUPONS
    track.custom('apply_coupon', { coupon: code, success: ok })
    if (ok) { setCoupon(code); notify(`Áp dụng mã ${code}`) } else notify('Mã không hợp lệ')
  }

  const next = () => {
    if (step === 0) { if (!validate()) return; track.custom('add_contact_info', { form_id: 'checkout_info' }) }
    if (step === 1) track.addShippingInfo(gaItems, shipping, coupon || undefined)
    if (step === 2) track.addPaymentInfo(gaItems, payment, coupon || undefined)
    setStep(step + 1)
  }

  const placeOrder = () => {
    setPlacing(true)
    const order = { id: 'ORD-' + Date.now().toString(36).toUpperCase(), items: gaItems, cartItems: cart, subtotal, discount, shippingFee, tax, total, coupon: coupon || undefined, shipping, payment, customer: form, createdAt: new Date().toISOString() }
    addOrder(order)
    track.purchase(order)
    clearCart()
    navigate(`/order/${order.id}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6" data-analytic-id="checkout-page" data-checkout-step={step + 1}>
      <h1 className="text-2xl font-bold">Thanh toán</h1>
      <ol className="my-6 flex items-center gap-2 text-xs sm:text-sm" data-analytic-id="checkout-steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full font-bold ${i <= step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
            <span className={i === step ? 'font-semibold' : 'text-slate-500'}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-slate-300 sm:w-10" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          {step === 0 && (
            <form className="grid gap-4 sm:grid-cols-2" id="checkout-info-form" data-analytic-id="checkout-info-form" onSubmit={(e) => { e.preventDefault(); next() }}>
              <Input label="Họ tên" value={form.name} onChange={set('name')} error={errors.name} name="name" data-analytic-id="input-name" />
              <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} name="email" data-analytic-id="input-email" />
              <Input label="Số điện thoại" value={form.phone} onChange={set('phone')} error={errors.phone} name="phone" data-analytic-id="input-phone" />
              <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">Tỉnh/Thành</span>
                <select value={form.city} onChange={set('city')} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" name="city" data-analytic-id="input-city">
                  {['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'].map((c) => <option key={c}>{c}</option>)}
                </select></label>
              <Input label="Địa chỉ" value={form.address} onChange={set('address')} error={errors.address} className="sm:col-span-2" name="address" data-analytic-id="input-address" />
              <div className="sm:col-span-2 flex justify-end"><Button type="submit" data-analytic-id="checkout-next" data-step="1" id="btn-checkout-step-1">Tiếp tục →</Button></div>
            </form>
          )}
          {step === 1 && (
            <div className="space-y-3" data-analytic-id="shipping-options">
              {Object.entries(SHIPPING).map(([k, v]) => (
                <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ring-1 ${shipping === k ? 'ring-brand-600 bg-brand-50' : 'ring-slate-200'}`}>
                  <input type="radio" name="shipping" checked={shipping === k} onChange={() => { setShipping(k); track.custom('select_shipping', { shipping_tier: k }) }} data-analytic-id="shipping-option" data-value={k} />
                  <span className="flex-1 text-sm font-medium">{v.label}</span>
                  <span className="text-sm font-bold">{fmt(v.fee)}</span>
                </label>
              ))}
              <Nav onBack={() => setStep(0)} onNext={next} step={2} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3" data-analytic-id="payment-options">
              {[['cod', '💵 Thanh toán khi nhận hàng'], ['card', '💳 Thẻ tín dụng / ghi nợ'], ['momo', '📱 Ví MoMo'], ['bank', '🏦 Chuyển khoản ngân hàng']].map(([k, l]) => (
                <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ring-1 ${payment === k ? 'ring-brand-600 bg-brand-50' : 'ring-slate-200'}`}>
                  <input type="radio" name="payment" checked={payment === k} onChange={() => { setPayment(k); track.custom('select_payment', { payment_type: k }) }} data-analytic-id="payment-option" data-value={k} />
                  <span className="text-sm font-medium">{l}</span>
                </label>
              ))}
              {payment === 'card' && (
                <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                  <Input label="Số thẻ" placeholder="4242 4242 4242 4242" className="sm:col-span-3" data-analytic-id="input-card-number" />
                  <Input label="Hết hạn" placeholder="MM/YY" data-analytic-id="input-card-exp" />
                  <Input label="CVC" placeholder="123" data-analytic-id="input-card-cvc" />
                </div>
              )}
              <Nav onBack={() => setStep(1)} onNext={next} step={3} />
            </div>
          )}
          {step === 3 && (
            <div data-analytic-id="review-order">
              <h3 className="font-semibold">Kiểm tra đơn hàng</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-slate-500">Người nhận</dt><dd>{form.name} · {form.phone}</dd></div>
                <div><dt className="text-slate-500">Email</dt><dd>{form.email}</dd></div>
                <div className="sm:col-span-2"><dt className="text-slate-500">Địa chỉ</dt><dd>{form.address}, {form.city}</dd></div>
                <div><dt className="text-slate-500">Vận chuyển</dt><dd>{SHIPPING[shipping].label}</dd></div>
                <div><dt className="text-slate-500">Thanh toán</dt><dd className="uppercase">{payment}</dd></div>
              </dl>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} data-analytic-id="checkout-back">← Quay lại</Button>
                <Button onClick={placeOrder} disabled={placing} data-analytic-id="place-order" id="btn-place-order">✅ Đặt hàng · {fmt(total)}</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-slate-200" data-analytic-id="checkout-summary">
          <h3 className="font-semibold">Đơn hàng ({cart.length})</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {cart.map((it) => <li key={it.key} className="flex justify-between"><span className="truncate pr-2">{it.product.name} <span className="text-slate-400">×{it.qty}</span></span><span>{fmt(it.qty * it.product.price)}</span></li>)}
          </ul>
          <div className="mt-4 flex gap-2">
            <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Mã giảm giá (SALE10)" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase" data-analytic-id="coupon-input" />
            <Button variant="secondary" onClick={applyCoupon} data-analytic-id="coupon-apply">Áp dụng</Button>
          </div>
          <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between"><dt>Tạm tính</dt><dd>{fmt(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Giảm giá ({coupon})</dt><dd>−{fmt(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Phí ship</dt><dd>{fmt(shippingFee)}</dd></div>
            <div className="flex justify-between"><dt>Thuế (8%)</dt><dd>{fmt(tax)}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold"><dt>Tổng</dt><dd>{fmt(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}

const Nav = ({ onBack, onNext, step }) => (
  <div className="flex justify-between pt-3">
    <Button variant="ghost" onClick={onBack} data-analytic-id="checkout-back">← Quay lại</Button>
    <Button onClick={onNext} data-analytic-id="checkout-next" data-step={step} id={`btn-checkout-step-${step}`}>Tiếp tục →</Button>
  </div>
)
