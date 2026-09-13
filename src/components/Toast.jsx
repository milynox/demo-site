import { useStore } from '../lib/store'
export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div key={toast.id} className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg" role="status">
      {toast.msg}
    </div>
  )
}
