import { useState } from 'react'
import { supabase } from '../supabaseClient'
import styles from './Auth.module.css'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('確認メールを送りました。メールを確認してください。')
    }
    setLoading(false)
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setMessage('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>𝕏</div>
        <h2 className={styles.title}>{isLogin ? 'ログイン' : 'アカウント作成'}</h2>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            minLength={6}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '処理中...' : isLogin ? 'ログイン' : '登録する'}
          </button>
        </form>

        <button onClick={switchMode} className={styles.toggle}>
          {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
        </button>
      </div>
    </div>
  )
}
