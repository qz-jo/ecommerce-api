import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function StoreLayout() {
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [location.pathname])
  return <><Navbar /><main id="main-content"><Outlet /></main><Footer /></>
}
