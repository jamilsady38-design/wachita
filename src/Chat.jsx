import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase.js'

function testReply(text) {
  const t = text.toLowerCase()
  if (/(qui t.a cr|qui vous a cr)/.test(t)) {
    return 'J’ai été créée par Ameen ! C’est mon fondateur.'
  }
  if (/(présente|qui es-tu|qui êtes-vous)/.test(t)) {
    return 'Bonjour ! Je suis WACHITA, votre assistante intelligente, créée par Ameen. Je suis ravie de faire votre connaissance. Comment puis-je vous aider ?'
  }
  if (/(bonjour|salut|salam|nanga def)/.test(t)) {
    return 'Bonjour ! Dalal ak jàmm ! Comment puis-je vous aider ?'
  }
  return 'Je suis encore en mode test : mon cerveau IA sera branché à l’étape 5. Mais votre message est bien enregistré !'
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [convId, setConvId] = useState(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const end = useRef(null)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function load() {
    const { data: convs } = await supabase
      .from('conversations')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
    if (!convs || !convs.length) return
    setConvId(convs[0].id)
    const { data } = await supabase
      .from('messages')
      .select('id, role, content')
      .eq('conversation_id', convs[0].id)
      .order('created_at')
    setMessages(data || [])
  }

  async function save(id, role, content) {
    const { data } = await supabase
      .from('messages')
      .insert({ conversation_id: id, role, content })
      .select('id, role, content')
      .single()
    return data
  }
  async function send(e) {
    e.preventDefault()
    const content = text.trim()
    if (!content || busy) return
    setBusy(true)
    setErr('')
    setText('')
    let id = convId
    if (!id) {
      const { data } = await supabase
        .from('conversations')
        .insert({ title: content.slice(0, 40) })
        .select('id')
        .single()
      if (!data) {
        setErr('Impossible d’enregistrer la conversation.')
        setBusy(false)
        return
      }
      id = data.id
      setConvId(id)
    }
    const mine = await save(id, 'user', content)
    if (!mine) {
      setErr('Message non enregistré. Réessayez.')
      setBusy(false)
      return
    }
    setMessages((m) => [...m, mine])
    const bot = await save(id, 'assistant', testReply(content))
    if (bot) setMessages((m) => [...m, bot])
    setBusy(false)
  }

  function fresh() {
    setConvId(null)
    setMessages([])
  }

  return (
    <div className="chat">
      <div className="top">
        <h1 className="logo">WACHITA</h1>
        <div>
          <button className="link" onClick={fresh}>Nouvelle conversation</button>
          {' · '}
          <button className="link" onClick={() => supabase.auth.signOut()}>Déconnexion</button>
        </div>
      </div>
      <div className="msgs">
        {messages.length === 0 && (
          <div className="hello">
            <h2>Bonjour, je suis WACHITA.</h2>
            <p>Comment puis-je vous aider aujourd’hui ?</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={'msg ' + (m.role === 'user' ? 'user' : 'bot')}>
            {m.content}
          </div>
        ))}
        <div ref={end} />
      </div>
      {err && <p className="err">{err}</p>}
      <form className="bar" onSubmit={send}>
        <input
          className="field"
          placeholder="Écrivez à WACHITA…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn" disabled={busy}>Envoyer</button>
      </form>
    </div>
  )
}
