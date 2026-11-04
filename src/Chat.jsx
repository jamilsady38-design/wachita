import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase.js'
import Avatar from './Avatar.jsx'
import { speak, stopSpeaking, listen, canListen } from './voice.js'

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
  const rec = useRef(null)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)

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
  async function send(e, spoken) {
    if (e) e.preventDefault()
    const content = (spoken || text).trim()
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
    if (bot) {
      setMessages((m) => [...m, bot])
      if (voiceOn) speak(bot.content, () => setSpeaking(true), () => setSpeaking(false))
    }
    setBusy(false)
  }  function toggleMic() {
    if (listening) {
      if (rec.current) rec.current.stop()
      return
    }
    stopSpeaking()
    setSpeaking(false)
    setErr('')
    rec.current = listen(
      (t) => send(null, t),
      () => setListening(false),
      (m) => setErr(m)
    )
    if (rec.current) setListening(true)
  }

  function fresh() {
    stopSpeaking()
    setSpeaking(false)
    setConvId(null)
    setMessages([])
  }

  return (
    <div className="chat">
      <div className="top">
        <h1 className="logo">WACHITA</h1>
        <div>
          <button className="link" onClick={() => { stopSpeaking(); setSpeaking(false); setVoiceOn(!voiceOn) }}>
            {voiceOn ? 'Voix : activée' : 'Voix : coupée'}
          </button>
          {' · '}
          <button className="link" onClick={fresh}>Nouvelle conversation</button>
          {' · '}
          <button className="link" onClick={() => supabase.auth.signOut()}>Déconnexion</button>
        </div>
      </div>
      <div className={'avwrap' + (messages.length ? ' sm' : '')}>
        <Avatar speaking={speaking} listening={listening} />
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
      <p className="state">{listening ? 'Je vous écoute…' : speaking ? 'WACHITA répond…' : ' '}</p>
      {err && <p className="err">{err}</p>}
      <form className="bar" onSubmit={send}>
        <input
          className="field"
          placeholder="Écrivez à WACHITA…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {canListen && (
          <button type="button" className={'mic' + (listening ? ' on' : '')} onClick={toggleMic} aria-label="Parler à WACHITA">
            <svg viewBox="0 0 24 24"><path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm6-4a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.94V22h2v-3.06A8 8 0 0 0 20 11z" /></svg>
          </button>
        )}
        <button className="btn" disabled={busy}>Envoyer</button>
      </form>
    </div>
  )
}
