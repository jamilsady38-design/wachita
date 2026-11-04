const SR = window.SpeechRecognition || window.webkitSpeechRecognition

export const canListen = Boolean(SR)
export const canSpeak = 'speechSynthesis' in window

const KEY = 'wachita_voice'
const MALE = /thomas|jacques|henri|nicolas|paul|daniel|antoine|mathieu|homme/i
const FEMALE = /amélie|amelie|audrey|aurélie|aurelie|marie|julie|céline|celine|léa|lea|virginie|denise|eloise|vivienne|femme/i

let token = 0

function readName() {
  try {
    return localStorage.getItem(KEY) || ''
  } catch (e) {
    return ''
  }
}

export function getVoiceName() {
  return readName()
}

export function setVoiceName(name) {
  try {
    localStorage.setItem(KEY, name)
  } catch (e) {
    /* rien */
  }
}

function loadVoices() {
  return new Promise((resolve) => {
    if (!canSpeak) return resolve([])
    const now = window.speechSynthesis.getVoices()
    if (now.length) return resolve(now)
    let done = false
    const finish = () => {
      if (done) return
      done = true
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true })
    setTimeout(finish, 1500)
  })
}

export async function frenchVoices() {
  const all = await loadVoices()
  return all.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('fr'))
}

async function pickVoice() {
  const list = await frenchVoices()
  if (!list.length) return null
  const saved = readName()
  const chosen = saved && list.find((v) => v.name === saved)
  if (chosen) return chosen
  return (
    list.find((v) => FEMALE.test(v.name)) ||
    list.find((v) => !MALE.test(v.name)) ||
    list[0]
  )
}

export async function speak(text, onStart, onEnd) {
  if (!canSpeak) {
    if (onEnd) onEnd()
    return
  }
  const my = ++token
  window.speechSynthesis.cancel()
  const v = await pickVoice()
  if (my !== token) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'fr-FR'
  if (v) {
    u.voice = v
    u.lang = v.lang
  }
  u.rate = 0.97
  u.pitch = 1
  u.onstart = () => onStart && onStart()
  u.onend = () => onEnd && onEnd()
  u.onerror = () => onEnd && onEnd()
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  token++
  if (canSpeak) window.speechSynthesis.cancel()
}

export function listen(onText, onEnd, onError) {
  if (!SR) {
    if (onError) onError('Ce navigateur ne sait pas écouter. Essayez Chrome ou Safari.', 'unsupported')
    return null
  }
  const r = new SR()
  r.lang = 'fr-FR'
  r.interimResults = false
  r.continuous = false
  r.maxAlternatives = 1
  r.onresult = (e) => onText(e.results[0][0].transcript)
  r.onerror = (e) => {
    if (!onError || e.error === 'aborted') return
    if (e.error === 'not-allowed') onError('Micro refusé : autorisez-le dans le navigateur.', e.error)
    else if (e.error === 'no-speech') onError('', e.error)
    else onError('Erreur micro : ' + e.error, e.error)
  }
  r.onend = () => onEnd && onEnd()
  r.start()
  return r
}
