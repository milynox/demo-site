import { useState } from 'react'
import { Link } from '../lib/router'
import { track } from '../lib/analytics'
import { useStore } from '../lib/store'

export default function Footer() {
  const [email, setEmail] = useState('')
  const { notify } = useStore()
  const submit = (e) => {
    e.preventDefault()
    if (!email) return
    track.generateLead(0)
    track.custom('newsletter_signup', { method: 'footer_form' })
    notify('Đã đăng ký nhận tin!')
    setEmail('')
  }
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white" id="site-footer">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="text-lg font-extrabold text-brand-700">ShopDemo</div>
          <p className="mt-2 text-sm text-slate-500">Trang demo để test GA4 / GTM ecommerce events.</p>
          <div className="mt-4 flex gap-2">
            {['facebook', 'instagram', 'tiktok'].map((s) => (
              <a key={s} href={`https://${s}.com`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-bold uppercase hover:bg-brand-100" data-analytic-id="social-link" data-social={s}>
                {s[0]}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Hỗ trợ</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link to="/about" data-analytic-id="footer-link" data-link="about">Về chúng tôi</Link></li>
            <li><Link to="/contact" data-analytic-id="footer-link" data-link="contact">Liên hệ</Link></li>
            <li><a href="#" data-analytic-id="footer-link" data-link="policy">Chính sách đổi trả</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Tải xuống</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="/catalog.pdf" download data-analytic-id="file-download" data-file="catalog.pdf" onClick={(e) => { e.preventDefault(); notify('Giả lập download catalog.pdf') }}>📄 Catalog 2026 (PDF)</a></li>
            <li><a href="tel:19001234" data-analytic-id="click-phone">📞 1900 1234</a></li>
            <li><a href="mailto:hello@shopdemo.test" data-analytic-id="click-email">✉️ hello@shopdemo.test</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Nhận tin khuyến mãi</h4>
          <form onSubmit={submit} className="mt-3 flex gap-2" data-analytic-id="newsletter-form" id="newsletter-form">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@cua.ban" className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" data-analytic-id="newsletter-email" />
            <button className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white" data-analytic-id="newsletter-submit">Gửi</button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">© 2026 ShopDemo · GTM-T22CLJ66</div>
    </footer>
  )
}
