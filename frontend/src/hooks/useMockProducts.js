import { useCallback, useEffect, useState } from 'react'
import { products } from '../data/products'

export function useMockProducts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const timer = window.setTimeout(() => {
      try {
        if (new URLSearchParams(window.location.search).get('state') === 'error') {
          throw new Error('Demo loading error')
        }
        setData(products.filter((product) => product.isActive))
      } catch {
        setError('We could not load the demo catalog. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 450)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => load(), [load])
  return { data, loading, error, retry: load }
}
