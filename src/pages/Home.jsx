import { useEffect } from 'react'
import { Link } from '../lib/router'
import { PRODUCTS, CATEGORIES, PROMOTIONS } from '../lib/products'
import { track } from '../lib/analytics'
import { ProductGrid } from '../components/ProductCard'
import { Section, Button } from '../components/ui'

const featured = PRODUCTS.filter((p) => p.oldPrice)
const newest = PRODUCTS.slice(-4)

export default function Home() {
  useEffect(() => {
    PROMOTIONS.forEach((p) => track.viewPromotion(p))
    track.viewItemList(featured, 'home_featured', 'Home – Khuyến mãi')
    track.viewItemList(newest, 'home_new', 'Home – Mới về')
  }, [])

  const [hero, mid] = PROMOTIONS
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Link
        to={hero.to}
        onClick={() => track.selectPromotion(hero)}
        className={`block overflow-hidden rounded-3xl bg-gradient-to-r ${hero.bg} p-10 text-white shadow-lg md:p-16`}
        data-analytic-id="promo-banner"
        data-promo-id={hero.id}
      >
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Ưu đãi hè</span>
        <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{hero.name}</h1>
        <p className="mt-2 max-w-md text-white/90">Giảm tới 30% cho toàn bộ áo thun, sơ mi, hoodie. Chỉ trong tuần này.</p>
        <Button variant="secondary" as="span" className="mt-6" data-analytic-id="promo-banner-cta">Mua ngay →</Button>
      </Link>

      <Section title="Danh mục">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4" data-analytic-id="category-tiles">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-brand-500" data-analytic-id="category-tile" data-category={c.id}>
              <span className="text-3xl">{c.icon}</span>
              <span className="font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Đang khuyến mãi" action={<Link to="/category/all" className="text-sm font-medium text-brand-600" data-analytic-id="see-all" data-list="home_featured">Xem tất cả →</Link>}>
        <ProductGrid products={featured} listId="home_featured" listName="Home – Khuyến mãi" />
      </Section>

      <Link
        to={mid.to}
        onClick={() => track.selectPromotion(mid)}
        className={`mt-12 flex items-center justify-between rounded-3xl bg-gradient-to-r ${mid.bg} p-8 text-white`}
        data-analytic-id="promo-banner"
        data-promo-id={mid.id}
      >
        <div>
          <h3 className="text-2xl font-bold">{mid.name}</h3>
          <p className="text-white/90">Sneaker mới về – freeship toàn quốc.</p>
        </div>
        <span className="text-5xl">👟</span>
      </Link>

      <Section title="Mới về">
        <ProductGrid products={newest} listId="home_new" listName="Home – Mới về" />
      </Section>
    </div>
  )
}
