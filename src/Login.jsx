import { useState } from 'react'
import { supabase } from './supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Connexion impossible. Vérifiez votre email et votre mot de passe.')
    setLoading(false)
  }

  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h1 className="logo">WACHITA</h1>
        <p className="sig">Espace réservé à Ameen</p>
        <input
          className="field"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="field"
          type="password"
          placeholder="Mot de passe"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="err">{error}</p>}
        <button className="btn" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
