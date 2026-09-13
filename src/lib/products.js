// Dữ liệu sản phẩm mẫu. Giá tính bằng VND.
export const CATEGORIES = [
  { id: 'ao', name: 'Áo', icon: '👕' },
  { id: 'quan', name: 'Quần', icon: '👖' },
  { id: 'giay', name: 'Giày', icon: '👟' },
  { id: 'phu-kien', name: 'Phụ kiện', icon: '🧢' },
]

export const PRODUCTS = [
  { id: 'SKU-001', name: 'Áo thun basic cotton', category: 'ao', brand: 'ShopDemo', price: 199000, oldPrice: 249000, rating: 4.6, color: '#f97316', variants: ['S', 'M', 'L', 'XL'], desc: 'Áo thun cotton 100%, form regular, thấm hút tốt.' },
  { id: 'SKU-002', name: 'Áo sơ mi linen', category: 'ao', brand: 'ShopDemo', price: 399000, rating: 4.4, color: '#0ea5e9', variants: ['S', 'M', 'L'], desc: 'Sơ mi linen mát mẻ, phù hợp đi làm và dạo phố.' },
  { id: 'SKU-003', name: 'Áo hoodie nỉ bông', category: 'ao', brand: 'Urban', price: 459000, oldPrice: 549000, rating: 4.8, color: '#6366f1', variants: ['M', 'L', 'XL'], desc: 'Hoodie nỉ bông dày dặn, giữ ấm tốt.' },
  { id: 'SKU-004', name: 'Quần jeans slim fit', category: 'quan', brand: 'Urban', price: 549000, rating: 4.5, color: '#1e40af', variants: ['29', '30', '31', '32'], desc: 'Jeans co giãn nhẹ, ôm vừa phải.' },
  { id: 'SKU-005', name: 'Quần jogger thể thao', category: 'quan', brand: 'Moveo', price: 329000, oldPrice: 399000, rating: 4.3, color: '#334155', variants: ['S', 'M', 'L'], desc: 'Jogger vải poly co giãn 4 chiều.' },
  { id: 'SKU-006', name: 'Quần short kaki', category: 'quan', brand: 'ShopDemo', price: 259000, rating: 4.2, color: '#a16207', variants: ['M', 'L', 'XL'], desc: 'Short kaki cổ điển, dễ phối đồ.' },
  { id: 'SKU-007', name: 'Giày sneaker trắng', category: 'giay', brand: 'Moveo', price: 899000, oldPrice: 1099000, rating: 4.9, color: '#e2e8f0', variants: ['39', '40', '41', '42', '43'], desc: 'Sneaker da tổng hợp, đế cao su êm.' },
  { id: 'SKU-008', name: 'Giày chạy bộ Air', category: 'giay', brand: 'Moveo', price: 1290000, rating: 4.7, color: '#dc2626', variants: ['40', '41', '42'], desc: 'Giày chạy bộ đệm khí, siêu nhẹ.' },
  { id: 'SKU-009', name: 'Sandal da nam', category: 'giay', brand: 'Urban', price: 499000, rating: 4.1, color: '#78350f', variants: ['40', '41', '42'], desc: 'Sandal da bò thật, quai chỉnh được.' },
  { id: 'SKU-010', name: 'Mũ lưỡi trai', category: 'phu-kien', brand: 'ShopDemo', price: 149000, rating: 4.4, color: '#16a34a', variants: ['Free size'], desc: 'Mũ lưỡi trai cotton, khóa điều chỉnh.' },
  { id: 'SKU-011', name: 'Túi đeo chéo mini', category: 'phu-kien', brand: 'Urban', price: 289000, oldPrice: 349000, rating: 4.6, color: '#7c3aed', variants: ['Free size'], desc: 'Túi đeo chéo chống nước, nhiều ngăn.' },
  { id: 'SKU-012', name: 'Thắt lưng da', category: 'phu-kien', brand: 'ShopDemo', price: 199000, rating: 4.0, color: '#0f172a', variants: ['100cm', '110cm'], desc: 'Thắt lưng da bò, khóa kim loại.' },
]

export const PROMOTIONS = [
  { id: 'PROMO-SUMMER', name: 'Summer Sale -30%', creative: 'hero_banner', slot: 'home_hero', to: '/category/ao', bg: 'from-orange-400 to-pink-500' },
  { id: 'PROMO-SHOES', name: 'Sneaker Week', creative: 'mid_banner', slot: 'home_mid', to: '/category/giay', bg: 'from-indigo-500 to-cyan-400' },
]

export const COUPONS = { SALE10: 0.1, FREESHIP: 0 }
export const SHIPPING = {
  standard: { label: 'Tiêu chuẩn (3-5 ngày)', fee: 30000 },
  express: { label: 'Nhanh (1-2 ngày)', fee: 60000 },
}

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id)
export const categoryName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id
export const fmt = (n) => n.toLocaleString('vi-VN') + '₫'
