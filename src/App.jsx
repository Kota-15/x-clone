import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Feed from './components/Feed'
import Header from './components/Header'
import styles from './App.module.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className={styles.loading}>読み込み中...</div>

  return (
    <div className={styles.app}>
      {!session ? (
        <Auth />
      ) : (
        <>
          <Header session={session} />
          <Feed session={session} />
        </>
      )}
    </div>
  )
}

export default App
