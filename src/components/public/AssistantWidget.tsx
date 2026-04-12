'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, User, ChevronRight, Mail, Phone, Building2, CheckCircle2, Loader2, Sparkles, Calendar, ExternalLink } from 'lucide-react'

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })
  const [isSystemActive, setIsSystemActive] = useState<boolean | null>(null)
  const [messages, setMessages] = useState<{id: string, role: string, content: string, toolCalls?: any[]}[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatParent = useRef<HTMLDivElement>(null)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const sendManualMessage = async (content: string) => {
    if (!content.trim() || isLoading) return
    
    setIsLoading(true)
    const userMsg = { id: Date.now().toString(), role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    
    try {
      const res = await fetch('/api/assistant/chat?v=3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Error en servidor')
      }
      
      const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.text || '', toolCalls: data.toolCalls }
      const finalMessages = [...newMessages, assistantMsg]
      setMessages(finalMessages)

      // Si el asistente menciona contacto o agenda, podríamos disparar el formulario
      if ((data.text && (data.text.toLowerCase().includes('contacto') || data.text.toLowerCase().includes('email'))) ||
          finalMessages.length >= 8) {
        if (!leadSaved && !showLeadForm) {
            setTimeout(() => setShowLeadForm(true), 2000)
        }
      }
      
    } catch (err: any) {
      console.error(err)
      window.alert("Fallo de conexión API: " + err.message)
      setMessages([...newMessages, { id: 'err', role: 'assistant', content: `[Error del Servidor]: No me pude conectar con Gemini. (${err.message})` }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/assistant/config')
        if (res.ok) {
          const data = await res.json()
          setIsSystemActive(data.active)
        } else {
          setIsSystemActive(true) // Fallback to true if API fails
        }
      } catch (error) {
        setIsSystemActive(true) // Fallback to true if fetch fails
      }
    }
    checkStatus()
  }, [])

  useEffect(() => {
    if (chatParent.current) {
      chatParent.current.scrollTop = chatParent.current.scrollHeight
    }
  }, [messages])

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/assistant/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          chatSummary: messages.filter(m => m.role === 'user').map(m => m.content).join(' | ')
        })
      })
      if (res.ok) {
        setLeadSaved(true)
        setShowLeadForm(false)
      }
    } catch (error) {
      console.error('Error saving lead:', error)
    }
  }

  if (isSystemActive === false) return null

const formatMessage = (text: string) => {
  const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  let html = safeText
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/^\s*\*\s+(.*)/gm, '<li class="ml-4 mb-1 relative before:content-[\'•\'] before:absolute before:-left-4 before:text-blue-500">$1</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')

  html = html.replace(/<br\/><li/g, '<li').replace(/<\/li><br\/>/g, '</li>')

  return (
    <div 
      className="text-[12.5px] leading-[1.6] [&_li]:block [&_strong]:text-current [&_strong]:opacity-90 [&_p:first-child]:mt-0"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} 
    />
  )
}

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-[9999] pointer-events-none flex flex-col items-end">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform relative group border border-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot size={28} className="sm:hidden" />
            <Bot size={32} className="hidden sm:block" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="pointer-events-auto relative sm:absolute sm:bottom-0 sm:right-0 w-full sm:w-[400px] h-[65vh] sm:h-[600px] max-h-[85vh] flex flex-col bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-black/5 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] sm:text-base text-black tracking-tight leading-tight">Partners Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">En línea</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatParent}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto border border-white shadow-sm">
                    <Sparkles className="text-blue-500" size={28} />
                  </div>
                  <h4 className="text-[15px] sm:text-base font-bold text-black tracking-tight px-6 leading-tight">
                    Hola, soy tu asistente experto en IA. ¿Cómo puedo ayudarte hoy?
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold px-10 leading-relaxed uppercase tracking-widest">
                    Asesoría en Agentes, RAG y Automatización.
                  </p>
                </div>
              )}

              {messages.map(m => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%]`}>
                    {m.content && (
                      <div className={`px-4 py-3 rounded-[1.5rem] ${
                        m.role === 'user' 
                          ? 'bg-black text-white shadow-md rounded-br-[0.5rem]' 
                          : 'bg-white border border-gray-100 text-black shadow-sm rounded-bl-[0.5rem]'
                      }`}>
                        {m.role === 'user' ? (
                          <span className="text-[13px] font-medium leading-relaxed">{m.content}</span>
                        ) : (
                          formatMessage(m.content)
                        )}
                      </div>
                    )}
                    
                    {/* Generative UI Cards */}
                    {m.toolCalls && Array.isArray(m.toolCalls) && m.toolCalls.map((tool: any, idx) => {
                      const toolName = tool.toolName || tool.name;
                      const args = tool.args || tool.arguments || {};
                      const toolId = tool.toolCallId || tool.id || idx;

                      if (toolName === 'proponer_reunion') {
                        return (
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            key={toolId} 
                            className="bg-white border border-gray-200 rounded-[1.25rem] overflow-hidden shadow-sm w-full mt-1"
                          >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                              <Calendar className="text-blue-600" size={16} />
                              <span className="font-bold text-[13px] text-gray-800 tracking-tight">Agendar Videollamada</span>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="text-[11.5px] text-gray-600 leading-relaxed">
                                {args.tipo_servicio && (
                                  <>
                                    <span className="inline-block bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold mb-2 tracking-tight">{args.tipo_servicio}</span>
                                    <br />
                                  </>
                                )}
                                {args.contexto || 'Conversemos sobre cómo podemos integrar IA en tu flujo de trabajo de forma exitosa.'}
                              </div>
                              <button 
                                onClick={() => window.open('https://cal.com/partnersiasolutions', '_blank')} 
                                className="w-full py-2.5 bg-black text-white rounded-xl text-[12px] font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                              >
                                Ver Horarios <ExternalLink size={14} />
                              </button>
                            </div>
                          </motion.div>
                        )
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white border border-gray-100 px-4 py-3 rounded-[1.5rem] rounded-bl-[0.5rem] flex gap-1.5 shadow-sm items-center h-10">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}

              {showLeadForm && !leadSaved && (
                <motion.div 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-black text-white rounded-[2rem] p-5 space-y-4 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-[30px]" />
                  <div className="relative z-10">
                    <h5 className="font-bold text-base leading-tight mb-1">¡Hablemos más a fondo!</h5>
                    <p className="text-[10px] text-gray-400 font-medium mb-3">Consultoría estratégica personalizada.</p>
                    
                    <form onSubmit={handleSaveLead} className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                        <input 
                          required
                          placeholder="Nombre completo"
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-8 py-2 text-[16px] sm:text-[11px] focus:outline-none focus:bg-white/20 transition-all font-medium"
                          value={leadData.name}
                          onChange={e => setLeadData({...leadData, name: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                        <input 
                          required type="email"
                          placeholder="Email corporativo"
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-8 py-2 text-[16px] sm:text-[11px] focus:outline-none focus:bg-white/20 transition-all font-medium"
                          value={leadData.email}
                          onChange={e => setLeadData({...leadData, email: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                        <input 
                          placeholder="Empresa"
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-8 py-2 text-[16px] sm:text-[11px] focus:outline-none focus:bg-white/20 transition-all font-medium"
                          value={leadData.company}
                          onChange={e => setLeadData({...leadData, company: e.target.value})}
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-white text-black font-black py-2.5 rounded-xl text-[10px] hover:bg-gray-200 transition-all active:scale-95 uppercase tracking-widest"
                      >
                        Enviar y Continuar
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {leadSaved && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50/50 border border-green-100 rounded-xl p-3 flex items-center gap-2"
                >
                  <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-green-700 tracking-tight leading-tight">¡Gracias! Hemos recibido tu solicitud. Contactaremos pronto.</p>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/20 border-t border-black/5">
              <div className="relative flex items-center gap-2">
                <input 
                  disabled={isLoading}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!input.trim() || isLoading) return;
                      const msg = input;
                      setInput('');
                      sendManualMessage(msg);
                    }
                  }}
                  placeholder="Escribe tu duda..."
                  className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[16px] sm:text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-black/5 shadow-sm"
                />
                <button 
                  type="button"
                  disabled={isLoading || !input}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!input.trim() || isLoading) return;
                    const msg = input;
                    setInput('');
                    sendManualMessage(msg);
                  }}
                  className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-lg shadow-gray-200 z-50 pointer-events-auto cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-[8px] text-center text-gray-400 font-black uppercase tracking-[0.3em] mt-3 opacity-60">
                Powered by Partners IA Solutions
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
