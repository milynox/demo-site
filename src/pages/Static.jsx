import { useState } from 'react'
import { Link } from '../lib/router'
import { track } from '../lib/analytics'
import { useStore } from '../lib/store'
import { Button, Input, Empty } from '../components/ui'

export function About() {
  return (
    <div className="prose mx-auto max-w-3xl px-4 pt-10">
      <h1 className="text-3xl font-bold">Về ShopDemo</h1>
      <p className="mt-4 text-slate-600">Đây là trang demo mua hàng dùng để test GA4 / GTM. Mọi element quan trọng đều có thuộc tính <code>data-analytic-id</code> để dễ tạo trigger trong GTM.</p>
      <p className="mt-2 text-slate-600">Các event ecommerce (view_item, add_to_cart, purchase, …) được push thẳng vào <code>window.dataLayer</code>. Bật panel “dataLayer” ở góc dưới phải để xem realtime.</p>
      <Link to="/" className="mt-6 inline-block text-brand-600" data-analytic-id="about-back-home">← Về trang chủ</Link>
    </div>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const { notify } = useStore()
  const submit = (e) => {
    e.preventDefault()
    track.generateLead(0)
    track.custom('contact_form_submit', { form_id: 'contact' })
    setSent(true); notify('Đã gửi liên hệ')
  }
  return (
    <div className="mx-auto max-w-lg px-4 pt-10">
      <h1 className="text-2xl font-bold">Liên hệ</h1>
      {sent ? <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-700">Cảm ơn bạn, chúng tôi sẽ phản hồi sớm.</p> : (
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200" id="contact-form" data-analytic-id="contact-form">
          <Input label="Họ tên" required name="name" data-analytic-id="input-name" />
          <Input label="Email" type="email" required name="email" data-analytic-id="input-email" />
          <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">Nội dung</span><textarea required rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" name="message" data-analytic-id="input-message" /></label>
          <Button type="submit" className="w-full" data-analytic-id="contact-submit">Gửi</Button>
        </form>
      )}
    </div>
  )
}

export function NotFound() {
  return <div className="mx-auto max-w-3xl px-4 pt-10"><Empty icon="🧭" title="404 – Không tìm thấy trang" action={<Button as={Link} to="/" data-analytic-id="404-home">Về trang chủ</Button>} /></div>
}
