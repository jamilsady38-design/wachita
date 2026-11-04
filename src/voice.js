const SR = window.SpeechRecognition || window.webkitSpeechRecognition

export const canListen = Boolean(SR)
export const canSpeak = 'speechSynthesis' in window

if (canSpeak) window.speechSynthesis.getVoices()

function frenchVoice() {
  const list = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('fr'))
  const pref = /amélie|amelie|audrey|aurélie|marie|julie|google français/i
  return list.find((v) => pref.test(v.name)) || list[0] || null
}

export function speak(text, onStart, onEnd) {
  if (!canSpeak) {
    if (onEnd) onEnd()
    return
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'fr-FR'
  const v = frenchVoice()
  if (v) u.voice = v
  u.rate = 1
  u.pitch = 1.05
  u.onstart = () => onStart && onStart()
  u.onend = () => onEnd && onEnd()
  u.onerror = () => onEnd && onEnd()
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel()
}

export function listen(onText, onEnd, onError) {
  if (!SR) {
    if (onError) onError('Ce navigateur ne sait pas écouter. Essayez Chrome ou Safari.')
    return null
  }
  const r = new SR()
  r.lang = 'fr-FR'
  r.interimResults = false
  r.continuous = false
  r.onresult = (e) => onText(e.results[0][0].transcript)
  r.onerror = (e) => {
    if (!onError) return
    if (e.error === 'not-allowed') onError('Micro refusé : autorisez-le dans le navigateur.')
    else if (e.error === 'no-speech') onError('Je n’ai rien entendu.')
    else onError('Erreur micro : ' + e.error)
  }
  r.onend = () => onEnd && onEnd()
  r.start()
  return r
}
