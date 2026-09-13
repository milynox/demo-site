// State toàn cục: giỏ hàng, user, wishlist, toast. Lưu localStorage để test journey nhiều bước.
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { track, toItem } from './analytics'

const StoreCtx = createContext(null)
const KEY = 'shopdemo_state_v1'

const initial = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s) return { cart: [], user: null, wishlist: [], orders: [], ...s }
  } catch { /* ignore */ }
  return { cart: [], user: null, wishlist: [], orders: [] }
}

function reducer(state, a) {
  switch (a.type) {
    case 'ADD': {
      const key = a.product.id + '|' + a.variant
      const ex = state.cart.find((c) => c.key === key)
      const cart = ex
        ? state.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + a.qty } : c))
        : [...state.cart, { key, product: a.product, variant: a.variant, qty: a.qty }]
      return { ...state, cart }
    }
    case 'SET_QTY':
      return { ...state, cart: state.cart.map((c) => (c.key === a.key ? { ...c, qty: Math.max(1, a.qty) } : c)) }
    case 'REMOVE':
      return { ...state, cart: state.cart.filter((c) => c.key !== a.key) }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'LOGIN':
      return { ...state, user: a.user }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'TOGGLE_WISH':
      return { ...state, wishlist: state.wishlist.includes(a.id) ? state.wishlist.filter((x) => x !== a.id) : [...state.wishlist, a.id] }
    case 'ADD_ORDER':
      return { ...state, orders: [a.order, ...state.orders] }
    default:
      return state
  }
}

export const cartItemToGa = (c) => toItem({ ...c.product, variant: c.variant }, { quantity: c.qty })

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial)
  const [toast, setToast] = useState(null)

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(state)), [state])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const api = useMemo(() => ({
    state,
    toast,
    notify: (msg) => setToast({ msg, id: Date.now() }),
    addToCart(product, variant, qty = 1) {
      dispatch({ type: 'ADD', product, variant, qty })
      track.addToCart([toItem({ ...product, variant }, { quantity: qty })])
      setToast({ msg: `Đã thêm ${product.name} vào giỏ`, id: Date.now() })
    },
    setQty(item, qty) {
      const diff = qty - item.qty
      if (diff === 0) return
      dispatch({ type: 'SET_QTY', key: item.key, qty })
      const ga = [cartItemToGa({ ...item, qty: Math.abs(diff) })]
      if (diff > 0) track.addToCart(ga); else track.removeFromCart(ga)
    },
    remove(item) {
      dispatch({ type: 'REMOVE', key: item.key })
      track.removeFromCart([cartItemToGa(item)])
    },
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    login(user, method) {
      dispatch({ type: 'LOGIN', user })
      track.login(method)
    },
    signUp(user, method) {
      dispatch({ type: 'LOGIN', user })
      track.signUp(method)
    },
    logout: () => dispatch({ type: 'LOGOUT' }),
    toggleWish(product) {
      const adding = !state.wishlist.includes(product.id)
      dispatch({ type: 'TOGGLE_WISH', id: product.id })
      if (adding) track.addToWishlist(product)
      setToast({ msg: adding ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích', id: Date.now() })
    },
    addOrder: (order) => dispatch({ type: 'ADD_ORDER', order }),
  }), [state, toast])

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)
export const cartCount = (cart) => cart.reduce((s, c) => s + c.qty, 0)
export const cartSubtotal = (cart) => cart.reduce((s, c) => s + c.qty * c.product.price, 0)
