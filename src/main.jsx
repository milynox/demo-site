import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // Không dùng StrictMode để effect (view_item, page_view…) không bị bắn 2 lần khi dev.
  <App />,
)
