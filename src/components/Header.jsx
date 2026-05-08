import { supabase } from '../supabaseClient'
import styles from './Header.module.css'

export default function Header({ session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const username = session.user.email.split('@')[0]

  return (
    <header className={styles.header}>
      <span className={styles.logo}>𝕏</span>
      <div className={styles.right}>
        <span className={styles.user}>@{username}</span>
        <button onClick={handleLogout} className={styles.logout}>
          ログアウト
        </button>
      </div>
    </header>
  )
}
