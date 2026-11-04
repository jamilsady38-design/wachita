import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase.js'
import Avatar from './Avatar.jsx'
import { speak, stopSpeaking, listen, canListen, frenchVoices, getVoiceName, setVoiceName } from './voice.js'

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
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [talkOn, setTalkOn] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true)
  const [voices, setVoices] = useState([])
  const [vName, setVName] = useState(getVoiceName())
  const end = useRef(null)
  const rec = useRef(null)
  const conv = useRef(null)
  const talk = useRef(false)
  const working = useRef(false)
  const talking = useRef(false)
  const voiceRef = useRef(true)
  const silent = useRef(0)

  useEffect(() => {
    load()
    frenchVoices().then(setVoices)
    return () => {
      talk.current = false
      stopSpeaking()
      if (rec.current) rec.current.stop()
    }
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
    conv.current = convs[0].id
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

  function done() {
    working.current = false
    setBusy(false)
  }

  function stopTalk() {
    talk.current = false
    setTalkOn(false)
    stopSpeaking()
    talking.current = false
    setSpeaking(false)
    if (rec.current) rec.current.stop()
  }

  function startListen() {
    if (!talk.current || working.current || talking.current || rec.current) return
    rec.current = listen(
      (t) => {
        silent.current = 0
        send(null, t)
      },
      () => {
        rec.current = null
        setListening(false)
        if (talk.current && !working.current && !talking.current) setTimeout(startListen, 300)
      },
      (m, code) => {
        if (code === 'no-speech') {
          silent.current += 1
          if (silent.current >= 3) {
            stopTalk()
            setErr('Conversation vocale arrêtée : je n’ai rien entendu.')
          }
          return
        }
        stopTalk()
        setErr(m)
      }
    )
    if (rec.current) setListening(true)
    else stopTalk()
  }

  function toggleMic() {
    if (talk.current) {
      stopTalk()
      return
    }
    setErr('')
    silent.current = 0
    talk.current = true
    setTalkOn(true)
    stopSpeaking()
    talking.current = false
    setSpeaking(false)
    startListen()
  }

  function afterSpeech() {
    talking.current = false
    setSpeaking(false)
    if (talk.current) startListen()
  }  async function send(e, spoken) {
    if (e) e.preventDefault()
    const content = (spoken || text).trim()
    if (!content || working.current) return
    working.current = true
    setBusy(true)
    setErr('')
    setText('')
    stopSpeaking()
    talking.current = false
    setSpeaking(false)
    let id = conv.current
    if (!id) {
      const { data } = await supabase
        .from('conversations')
        .insert({ title: content.slice(0, 40) })
        .select('id')
        .single()
      if (!data) {
        setErr('Impossible d’enregistrer la conversation.')
        done()
        return
      }
      id = data.id
      conv.current = id
    }
    const mine = await save(id, 'user', content)
    if (!mine) {
      setErr('Message non enregistré. Réessayez.')
      done()
      return
    }
    setMessages((m) => [...m, mine])
    const bot = await save(id, 'assistant', testReply(content))
    done()
    if (!bot) {
      if (talk.current) startListen()
      return
    }
    setMessages((m) => [...m, bot])
    if (voiceRef.current) {
      speak(bot.content, () => { talking.current = true; setSpeaking(true) }, afterSpeech)
    } else if (talk.current) {
      startListen()
    }
  }

  function fresh() {
    stopSpeaking()
    talking.current = false
    setSpeaking(false)
    conv.current = null
    setMessages([])
  }

  function toggleVoice() {
    const on = !voiceOn
    setVoiceOn(on)
    voiceRef.current = on
    if (!on) {
      stopSpeaking()
      talking.current = false
      setSpeaking(false)
    }
  }

  function pickVoice(e) {
    const n = e.target.value
    setVoiceName(n)
    setVName(n)
    speak('Bonjour, je suis WACHITA.', () => setSpeaking(true), () => setSpeaking(false))
  }

  const label = listening
    ? 'Je vous écoute…'
    : speaking
      ? 'WACHITA répond…'
      : busy
        ? 'Je réfléchis…'
        : talkOn
          ? 'Conversation vocale active'
          : ' '

  return (
    <div className="chat">
      <div className="top">
        <h1 className="logo">WACHITA</h1>
        <div>
          {voices.length > 1 && (
            <select
              value={vName}
              onChange={pickVoice}
              aria-label="Choisir la voix"
              style={{ background: '#ffffff10', color: 'var(--cr)', border: '1px solid #ffffff22', borderRadius: 8, padding: '3px 6px', fontSize: 13, maxWidth: 130, marginRight: 8 }}
            >
              <option value="">Voix auto</option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          )}
          <button className="link" onClick={toggleVoice}>
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
      <p className="state">{label}</p>
      {err && <p className="err">{err}</p>}
      <form className="bar" onSubmit={send}>
        <input
          className="field"
          placeholder="Écrivez à WACHITA…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {canListen && (
          <button
            type="button"
            className={'mic' + (talkOn ? ' on' : '')}
            onClick={toggleMic}
            aria-label={talkOn ? 'Arrêter la conversation vocale' : 'Parler à WACHITA'}
          >
            <svg viewBox="0 0 24 24">
              {talkOn ? (
                <path d="M7 7h10v10H7z" />
              ) : (
                <path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm6-4a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.94V22h2v-3.06A8 8 0 0 0 20 11z" />
              )}
            </svg>
          </button>
        )}
        <button className="btn" disabled={busy}>Envoyer</button>
      </form>
    </div>
  )
}
