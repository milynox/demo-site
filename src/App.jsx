import { RouterProvider, useRouter, matchRoute } from './lib/router'
import { StoreProvider } from './lib/store'
import { track } from './lib/analytics'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import DebugPanel from './components/DebugPanel'
import Home from './pages/Home'
import Category from './pages/Category'
import Search from './pages/Search'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import { About, Contact, NotFound } from './pages/Static'

const ROUTES = {
  '/': [Home, 'Trang chủ'],
  '/category/:id': [Category, 'Danh mục'],
  '/search': [Search, 'Tìm kiếm'],
  '/product/:id': [Product, 'Sản phẩm'],
  '/cart': [Cart, 'Giỏ hàng'],
  '/checkout': [Checkout, 'Thanh toán'],
  '/order/:id': [OrderSuccess, 'Đặt hàng thành công'],
  '/login': [Login, 'Đăng nhập'],
  '/account': [Account, 'Tài khoản'],
  '/wishlist': [Wishlist, 'Yêu thích'],
  '/about': [About, 'Về chúng tôi'],
  '/contact': [Contact, 'Liên hệ'],
  '*': [NotFound, '404'],
}

function Pages() {
  const { path } = useRouter()
  const [pathname, qs = ''] = path.split('?')
  const { page: [Page], params } = matchRoute(pathname, ROUTES)
  const query = new URLSearchParams(qs)
  const pageKey = pathname + (params.id ?? '')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-10" id="main" data-page={pathname.split('/')[1] || 'home'}>
        <Page key={pageKey} params={params} query={query} />
      </main>
      <Footer />
      <Toast />
      <DebugPanel />
    </div>
  )
}

function onRouteChange(path) {
  const [pathname] = path.split('?')
  const { page: [, title] } = matchRoute(pathname, ROUTES)
  document.title = `${title} · ShopDemo`
  track.pageView(path, document.title)
}

export default function App() {
  return (
    <RouterProvider onChange={onRouteChange}>
      <StoreProvider>
        <Pages />
      </StoreProvider>
    </RouterProvider>
  )
}
