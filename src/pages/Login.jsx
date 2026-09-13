import { useState } from 'react'
import { useRouter } from '../lib/router'
import { useStore } from '../lib/store'
import { track } from '../lib/analytics'
import { Button, Input } from '../components/ui'

export default function Login({ mode = 'login' }) {
  const { login, signUp, notify } = useStore()
  const { navigate } = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [tab, setTab] = useState(mode)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const user = { name: form.name || form.email.split('@')[0], email: form.email, id: 'U-' + btoa(form.email).slice(0, 8) }
    if (tab === 'login') login(user, 'email'); else signUp(user, 'email')
    notify(tab === 'login' ? 'Đăng nhập thành công' : 'Tạo tài khoản thành công')
    navigate('/')
  }
  const social = (method) => {
    const user = { name: method === 'google' ? 'Google User' : 'FB User', email: `${method}@demo.test`, id: 'U-' + method }
    if (tab === 'login') login(user, method); else signUp(user, method)
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-10">
      <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200">
        <div className="mb-6 flex rounded-xl bg-slate-100 p-1 text-sm font-semibold" data-analytic-id="auth-tabs">
          {[['login', 'Đăng nhập'], ['signup', 'Đăng ký']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-lg py-2 ${tab === k ? 'bg-white shadow' : 'text-slate-500'}`} data-analytic-id="auth-tab" data-tab={k}>{l}</button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-4" id={`${tab}-form`} data-analytic-id={`${tab}-form`}>
          {tab === 'signup' && <Input label="Họ tên" required value={form.name} onChange={set('name')} name="name" data-analytic-id="input-name" />}
          <Input label="Email" type="email" required value={form.email} onChange={set('email')} name="email" data-analytic-id="input-email" />
          <Input label="Mật khẩu" type="password" required minLength={4} value={form.password} onChange={set('password')} name="password" data-analytic-id="input-password" />
          <Button type="submit" className="w-full" data-analytic-id={`${tab}-submit`} id={`btn-${tab}`}>{tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />hoặc<span className="h-px flex-1 bg-slate-200" /></div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => social('google')} data-analytic-id="social-auth" data-method="google">G · Google</Button>
          <Button variant="secondary" onClick={() => social('facebook')} data-analytic-id="social-auth" data-method="facebook">f · Facebook</Button>
        </div>
        <button className="mt-5 block w-full text-center text-xs text-slate-500 hover:text-brand-600" onClick={() => track.custom('forgot_password_click')} data-analytic-id="forgot-password">Quên mật khẩu?</button>
      </div>
    </div>
  )
}
