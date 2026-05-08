import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import styles from './Feed.module.css'

export default function Feed({ session }) {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      }, (payload) => {
        setPosts((prev) => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) setPosts(data)
    setLoading(false)
  }

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setPosting(true)
    const { error } = await supabase.from('posts').insert({
      user_id: session.user.id,
      user_email: session.user.email,
      content: content.trim(),
    })

    if (!error) setContent('')
    setPosting(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handlePost(e)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    return date.toLocaleDateString('ja-JP')
  }

  const toUsername = (email) => (email ? email.split('@')[0] : '不明')
  const toAvatar = (email) => (email ? email[0].toUpperCase() : '?')

  return (
    <main>
      <form onSubmit={handlePost} className={styles.postForm}>
        <div className={styles.avatar}>
          {toAvatar(session.user.email)}
        </div>
        <div className={styles.postRight}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="いまどうしてる？"
            className={styles.textarea}
            maxLength={280}
            rows={3}
          />
          <div className={styles.postActions}>
            <span className={styles.hint}>⌘+Enter で投稿</span>
            <span className={styles.charCount}>{content.length} / 280</span>
            <button
              type="submit"
              className={styles.postButton}
              disabled={!content.trim() || posting}
            >
              {posting ? '投稿中...' : 'ポスト'}
            </button>
          </div>
        </div>
      </form>

      <div className={styles.divider} />

      {loading ? (
        <div className={styles.center}>読み込み中...</div>
      ) : posts.length === 0 ? (
        <div className={styles.center}>まだ投稿がありません</div>
      ) : (
        posts.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.postAvatar}>
              {toAvatar(post.user_email)}
            </div>
            <div className={styles.postContent}>
              <div className={styles.postMeta}>
                <span className={styles.postUser}>@{toUsername(post.user_email)}</span>
                <span className={styles.postTime}>{formatDate(post.created_at)}</span>
              </div>
              <p className={styles.postText}>{post.content}</p>
            </div>
          </article>
        ))
      )}
    </main>
  )
}
