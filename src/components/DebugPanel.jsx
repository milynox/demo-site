// Panel hiển thị realtime các event push vào dataLayer để kiểm tra khi test.
import { useEffect, useState } from 'react'
import { onEvent } from '../lib/analytics'

export default function DebugPanel() {
  // Lấy luôn các event đã push trước khi panel mount (page_view đầu tiên, view_item_list…)
  const [events, setEvents] = useState(() =>
    (window.dataLayer || []).filter((e) => e.event && !e.event.startsWith('gtm.')).map((e, i) => ({ ...e, _ts: Date.now() + i })).reverse(),
  )
  const [open, setOpen] = useState(() => localStorage.getItem('shopdemo_debug') === '1')
  const [sel, setSel] = useState(null)

  useEffect(() => onEvent((e) => setEvents((prev) => [e, ...prev].slice(0, 100))), [])
  useEffect(() => localStorage.setItem('shopdemo_debug', open ? '1' : '0'), [open])

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-700"
        data-analytic-id="debug-toggle"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" /> dataLayer ({events.length})
      </button>
      {open && (
        <aside className="fixed bottom-16 right-4 z-50 flex h-[60vh] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-slate-900 text-slate-100 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs">
            <span className="font-semibold">dataLayer events</span>
            <button onClick={() => { setEvents([]); setSel(null) }} className="text-slate-400 hover:text-white">Xóa</button>
          </div>
          <div className="flex-1 overflow-auto font-mono text-xs">
            {events.length === 0 && <p className="p-4 text-slate-500">Chưa có event nào…</p>}
            {events.map((e) => (
              <div key={e._ts + e.event}>
                <button onClick={() => setSel(sel === e ? null : e)} className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-white/5">
                  <span className={e.ecommerce ? 'text-emerald-300' : 'text-sky-300'}>{e.event}</span>
                  <span className="text-slate-500">{new Date(e._ts).toLocaleTimeString()}</span>
                </button>
                {sel === e && <pre className="max-h-64 overflow-auto bg-black/40 px-4 py-2 text-[11px] text-slate-300">{JSON.stringify(strip(e), null, 2)}</pre>}
              </div>
            ))}
          </div>
        </aside>
      )}
    </>
  )
}
const strip = ({ _ts, ...rest }) => rest
