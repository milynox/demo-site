// Router SPA tối giản dựa trên History API (pushState) để GTM bắt được
// trigger "History Change" và test page_view virtual.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const RouterCtx = createContext(null)

// onChange được gọi đồng bộ ngay khi URL đổi (trước khi trang mới render)
// để page_view luôn đi trước các event của trang.
export function RouterProvider({ children, onChange }) {
  const [path, setPath] = useState(() => { const p = currentPath(); onChange?.(p); return p })

  useEffect(() => {
    const onPop = () => { const p = currentPath(); onChange?.(p); setPath(p) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onChange])

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (to === currentPath()) return
    const url = base() + to
    if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url)
    onChange?.(to)
    setPath(to)
    window.scrollTo({ top: 0 })
  }, [onChange])

  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>
}

export const useRouter = () => useContext(RouterCtx)

// Hỗ trợ deploy dưới sub-path (GitLab Pages): base là thư mục chứa index.html.
function base() {
  const b = import.meta.env.BASE_URL
  if (b === './' || b === '/') return ''
  return b.replace(/\/$/, '')
}
function currentPath() {
  const p = (location.pathname.replace(base(), '') || '/') + location.search
  return p.startsWith('/') ? p : '/' + p
}

// Trả về { page, params } theo pattern kiểu "/product/:id"
export function matchRoute(path, routes) {
  for (const [pattern, page] of Object.entries(routes)) {
    const keys = []
    const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '$')
    const m = path.match(re)
    if (m) return { page, params: Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) }
  }
  return { page: routes['*'], params: {} }
}

export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate } = useRouter()
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return
        e.preventDefault()
        onClick?.(e)
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
