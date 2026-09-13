// Đẩy event GA4 ecommerce vào window.dataLayer để GTM đọc.
// Mọi event đều được ghi lại trong __events để Debug panel hiển thị.
import { categoryName } from './products'

export const CURRENCY = 'VND'

export function toItem(p, extra = {}) {
  return {
    item_id: p.id,
    item_name: p.name,
    item_brand: p.brand,
    item_category: categoryName(p.category),
    price: p.price,
    quantity: 1,
    ...(p.variant ? { item_variant: p.variant } : {}),
    ...extra,
  }
}

export function itemsValue(items) {
  return items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0)
}

const listeners = new Set()
export function onEvent(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function push(event, payload = {}) {
  window.dataLayer = window.dataLayer || []
  // Reset object ecommerce trước mỗi event ecommerce theo khuyến nghị của Google.
  if (payload.ecommerce) window.dataLayer.push({ ecommerce: null })
  const entry = { event, ...payload }
  window.dataLayer.push(entry)
  const record = { ...entry, _ts: Date.now() }
  listeners.forEach((fn) => fn(record))
  return record
}

export const track = {
  pageView: (path, title) => push('page_view', { page_location: location.origin + path, page_path: path, page_title: title }),
  viewItemList: (products, listId, listName) =>
    push('view_item_list', { ecommerce: { item_list_id: listId, item_list_name: listName, items: products.map((p, i) => toItem(p, { index: i, item_list_id: listId, item_list_name: listName })) } }),
  selectItem: (p, listId, listName, index) =>
    push('select_item', { ecommerce: { item_list_id: listId, item_list_name: listName, items: [toItem(p, { index, item_list_id: listId, item_list_name: listName })] } }),
  viewItem: (p) => push('view_item', { ecommerce: { currency: CURRENCY, value: p.price, items: [toItem(p)] } }),
  addToCart: (items) => push('add_to_cart', { ecommerce: { currency: CURRENCY, value: itemsValue(items), items } }),
  removeFromCart: (items) => push('remove_from_cart', { ecommerce: { currency: CURRENCY, value: itemsValue(items), items } }),
  viewCart: (items) => push('view_cart', { ecommerce: { currency: CURRENCY, value: itemsValue(items), items } }),
  addToWishlist: (p) => push('add_to_wishlist', { ecommerce: { currency: CURRENCY, value: p.price, items: [toItem(p)] } }),
  beginCheckout: (items, coupon) => push('begin_checkout', { ecommerce: { currency: CURRENCY, value: itemsValue(items), coupon, items } }),
  addShippingInfo: (items, tier, coupon) => push('add_shipping_info', { ecommerce: { currency: CURRENCY, value: itemsValue(items), coupon, shipping_tier: tier, items } }),
  addPaymentInfo: (items, type, coupon) => push('add_payment_info', { ecommerce: { currency: CURRENCY, value: itemsValue(items), coupon, payment_type: type, items } }),
  purchase: (order) =>
    push('purchase', { ecommerce: { transaction_id: order.id, value: order.total, tax: order.tax, shipping: order.shippingFee, currency: CURRENCY, coupon: order.coupon, items: order.items } }),
  viewPromotion: (promo) =>
    push('view_promotion', { ecommerce: { promotion_id: promo.id, promotion_name: promo.name, creative_name: promo.creative, creative_slot: promo.slot } }),
  selectPromotion: (promo) =>
    push('select_promotion', { ecommerce: { promotion_id: promo.id, promotion_name: promo.name, creative_name: promo.creative, creative_slot: promo.slot } }),
  search: (term) => push('search', { search_term: term }),
  login: (method) => push('login', { method }),
  signUp: (method) => push('sign_up', { method }),
  generateLead: (value) => push('generate_lead', { currency: CURRENCY, value }),
  custom: (name, params) => push(name, params),
}
