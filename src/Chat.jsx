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
  const
