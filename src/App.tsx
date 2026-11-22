import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useParams } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ThemesPage from './pages/ThemesPage'
import NotFound from './pages/NotFound'
import InviteLoader from './components/site/InviteLoader'
import { getTheme } from './themes/registry'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function InviteRoute() {
  const { slug } = useParams()
  const theme = getTheme(slug)
  if (!theme) return <NotFound />
  const Invite = theme.component
  return (
    <Suspense fallback={<InviteLoader />}>
      <Invite />
    </Suspense>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/invite/:slug" element={<InviteRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
