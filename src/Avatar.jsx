export default function Avatar({ speaking = false, listening = false }) {
  return (
    <div className={'avatar' + (speaking ? ' talk' : '') + (listening ? ' listen' : '')}>
      <svg viewBox="0 0 400 400" role="img" aria-label="WACHITA, souriante, en boubou bordeaux et doré">
      <defs>
      <radialGradient id="bg" cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#C98A5E"/><stop offset=".55" stopColor="#8A4A35"/><stop offset="1" stopColor="#4A1528"/></radialGradient>
      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7A4730"/><stop offset="1" stopColor="#55301F"/></linearGradient>
      <linearGradient id="robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8C3A2C"/><stop offset="1" stopColor="#5E1D2E"/></linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F0CB82"/><stop offset="1" stopColor="#B8843F"/></linearGradient>
      <linearGradient id="wrap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C9784A"/><stop offset=".5" stopColor="#8E3B24"/><stop offset="1" stopColor="#5B1F25"/></linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <g className="body">
      <g fill="none" stroke="#1B1210" strokeLinecap="round">
      <path d="M146 150 C132 200 126 240 122 292" strokeWidth="13"/>
      <path d="M158 160 C148 205 144 245 142 300" strokeWidth="11"/>
      <path d="M254 150 C268 200 274 240 278 292" strokeWidth="13"/>
      <path d="M242 160 C252 205 256 245 258 300" strokeWidth="11"/>
      </g>
      <g fill="none" stroke="#4A3226" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round">
      <path d="M146 150 C132 200 126 240 122 292"/><path d="M158 160 C148 205 144 245 142 300"/>
      <path d="M254 150 C268 200 274 240 278 292"/><path d="M242 160 C252 205 256 245 258 300"/>
      </g>
      <path d="M78 400 L92 300 C110 275 150 262 200 262 C250 262 290 275 308 300 L322 400 Z" fill="url(#robe)"/>
      <path d="M40 400 C42 340 62 300 96 288 L122 300 L104 400 Z" fill="#7B2E2B"/>
      <path d="M360 400 C358 340 338 300 304 288 L278 300 L296 400 Z" fill="#7B2E2B"/>
      <g fill="none" stroke="#D49A70" strokeWidth="2" opacity=".75">
      <path d="M52 380 q14 -10 28 0 t28 0"/><path d="M62 350 q12 -9 24 0 t24 0"/>
      <path d="M292 380 q14 -10 28 0 t28 0"/><path d="M290 350 q12 -9 24 0 t24 0"/>
      </g>
      <path d="M150 272 L200 372 L250 272" fill="none" stroke="url(#gold)" strokeWidth="7" strokeLinejoin="round"/>
      <path d="M164 276 L200 350 L236 276" fill="none" stroke="url(#gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <g fill="url(#gold)"><circle cx="200" cy="378" r="5"/><circle cx="178" cy="318" r="3"/><circle cx="222" cy="318" r="3"/><circle cx="188" cy="340" r="3"/><circle cx="212" cy="340" r="3"/></g>
      <path d="M172 236 L172 276 C186 290 214 290 228 276 L228 236 Z" fill="#5A3322"/>
      <path d="M172 262 C186 278 214 278 228 262 L228 276 C214 290 186 290 172 276 Z" fill="#46261A" opacity=".5"/>
      <path d="M168 268 C176 300 190 318 200 330 C210 318 224 300 232 268" fill="none" stroke="url(#gold)" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M200 322 C186 312 184 330 200 350 C216 330 214 312 200 322 Z" fill="url(#gold)" stroke="#B8843F" strokeWidth="1.5"/>
      <circle cx="200" cy="334" r="3" fill="#F7E2A8"/>
      <ellipse cx="143" cy="188" rx="9" ry="14" fill="#5A3322"/><ellipse cx="257" cy="188" rx="9" ry="14" fill="#5A3322"/>
      <circle cx="141" cy="206" r="4.5" fill="url(#gold)"/><circle cx="259" cy="206" r="4.5" fill="url(#gold)"/>
      <path d="M146 168 C146 130 170 108 200 108 C230 108 254 130 254 168 C254 214 232 246 200 246 C168 246 146 214 146 168 Z" fill="url(#skin)"/>
      <ellipse cx="178" cy="156" rx="16" ry="22" fill="#9A6040" opacity=".22"/>
      <ellipse cx="166" cy="206" rx="11" ry="7" fill="#C06A4A" opacity=".28"/><ellipse cx="234" cy="206" rx="11" ry="7" fill="#C06A4A" opacity=".28"/>
      <path d="M140 150 C138 108 162 78 202 78 C240 78 264 104 262 146 C250 124 232 112 200 112 C170 112 152 126 140 150 Z" fill="url(#wrap)"/>
      <path d="M150 134 C160 106 178 94 204 94" fill="none" stroke="#E5B56F" strokeWidth="3" opacity=".85"/>
      <path d="M162 128 C172 108 190 100 210 100" fill="none" stroke="#2E0C19" strokeWidth="3" opacity=".5"/>
      <path d="M176 96 C170 60 200 46 224 58 C240 66 238 86 218 90 C230 70 208 62 196 76 C188 86 190 96 176 96 Z" fill="url(#wrap)"/>
      <path d="M186 74 C196 64 212 62 222 68" fill="none" stroke="#E5B56F" strokeWidth="2.5" opacity=".8"/>
      <path d="M165 150 q15 -9 30 -2" fill="none" stroke="#1B1210" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M205 148 q15 -7 30 2" fill="none" stroke="#1B1210" strokeWidth="3.2" strokeLinecap="round"/>
      <g className="eyes">
      <ellipse cx="180" cy="168" rx="10" ry="6.5" fill="#F6EDE3"/><circle cx="180" cy="168.5" r="4.6" fill="#2A1710"/><circle cx="181.8" cy="166.8" r="1.4" fill="#fff"/>
      <ellipse cx="220" cy="168" rx="10" ry="6.5" fill="#F6EDE3"/><circle cx="220" cy="168.5" r="4.6" fill="#2A1710"/><circle cx="221.8" cy="166.8" r="1.4" fill="#fff"/>
      <path d="M169 166 Q180 157 191 166" fill="none" stroke="#1B1210" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M209 166 Q220 157 231 166" fill="none" stroke="#1B1210" strokeWidth="2.6" strokeLinecap="round"/>
      </g>
      <path d="M196 180 C194 194 192 198 194 202 C198 206 202 206 206 202 C208 198 206 194 204 180" fill="none" stroke="#3E2216" strokeWidth="2.2" strokeLinecap="round" opacity=".7"/>
      <g className="mouthSmile">
      <path d="M176 212 C186 232 214 232 224 212 C214 216 186 216 176 212 Z" fill="#F8F1E8"/>
      <path d="M174 211 C186 217 214 217 226 211" fill="none" stroke="#7A2430" strokeWidth="3.4" strokeLinecap="round"/>
      <path d="M176 213 C186 234 214 234 224 213" fill="none" stroke="#7A2430" strokeWidth="3" strokeLinecap="round"/>
      </g>
      <g className="mouthTalk">
      <path d="M178 213 C186 214 214 214 222 213 C220 234 182 234 178 213 Z" fill="#3A0F18"/>
      <path d="M180 214 C188 216 212 216 220 214 C219 218 181 218 180 214 Z" fill="#F8F1E8"/>
      <path d="M190 226 C196 222 204 222 210 226 C206 231 194 231 190 226 Z" fill="#B4505A"/>
      <path d="M176 212 C186 216 214 216 224 212" fill="none" stroke="#7A2430" strokeWidth="3.4" strokeLinecap="round"/>
      </g>
      </g>
      </svg>
    </div>
  )
}
