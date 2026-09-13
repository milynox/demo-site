# ShopDemo – trang mua hàng để test GA4 / GTM

SPA React + Vite + Tailwind CSS v4 mô phỏng một cửa hàng thời trang. Mục đích: có môi trường để gán GA4 event lên element và test các journey (xem sản phẩm → thêm giỏ → checkout → purchase).

## Chạy

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build ra dist/ (+ dist/404.html cho SPA fallback)
npm run preview   # chạy thử bản build
npm run lint
```

GTM container `GTM-T22CLJ66` được nhúng trong `index.html`.

## Routes (History API – GTM "History Change" trigger bắt được)

| Path | Trang |
|---|---|
| `/` | Home (banner promo, danh mục, list sản phẩm) |
| `/category/:id` (`ao`, `quan`, `giay`, `phu-kien`, `all`) | Danh mục, filter brand, sort |
| `/search?q=` | Tìm kiếm |
| `/product/:id` (`SKU-001` … `SKU-012`) | Chi tiết sản phẩm |
| `/cart` | Giỏ hàng |
| `/checkout` | Checkout 4 bước: thông tin → vận chuyển → thanh toán → xác nhận |
| `/order/:id` | Đặt hàng thành công |
| `/login` | Đăng nhập / đăng ký (email, Google, Facebook giả lập) |
| `/account` | Tài khoản + lịch sử đơn |
| `/wishlist`, `/about`, `/contact` | |

## Event tự push vào `window.dataLayer`

Định nghĩa ở [`src/lib/analytics.js`](src/lib/analytics.js). Trước mỗi event ecommerce có push `{ ecommerce: null }` theo khuyến nghị của Google.

- `page_view` (virtual, mỗi lần đổi route – bắn **trước** các event khác của trang)
- Ecommerce chuẩn GA4: `view_promotion`, `select_promotion`, `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `add_to_wishlist`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`
- Khác: `search`, `login`, `sign_up`, `generate_lead`
- Custom: `view_search_results`, `filter_apply`, `sort_change`, `select_variant`, `product_tab_view`, `checkout_progress`, `add_contact_info`, `form_error`, `apply_coupon`, `select_shipping`, `select_payment`, `newsletter_signup`, `contact_form_submit`, `forgot_password_click`

Nút **dataLayer** góc dưới phải mở panel xem realtime từng event + payload.

## Gán tag theo element

Mọi element tương tác có `data-analytic-id` (kèm `data-product-id`, `data-category`, `data-step`, `data-variant`, … khi phù hợp) để tạo trigger Click trong GTM bằng CSS selector, ví dụ `[data-analytic-id="add-to-cart"]`. Các nút quan trọng còn có `id`: `btn-add-to-cart`, `btn-buy-now`, `btn-checkout`, `btn-checkout-step-1..3`, `btn-place-order`, `btn-login`, `btn-signup`, `cart-icon`. `<main>` có `data-page="home|category|product|cart|checkout|…"`.

Ngoài ra có sẵn: link ngoài (social), `tel:`/`mailto:`, link download PDF, form newsletter/contact để test Enhanced Measurement.

## Dữ liệu test

- Mã giảm giá: `SALE10` (−10%), `FREESHIP`
- Giỏ hàng / user / đơn hàng lưu trong `localStorage` (`shopdemo_state_v1`) – xóa key này để reset journey.

## Deploy GitLab Pages

`.gitlab-ci.yml` chỉ chạy khi push tag. Build với `BASE_PATH=/<project>/` để asset path đúng dưới sub-path; `dist/404.html` là bản copy của `index.html` để reload deep-link vẫn chạy SPA.
