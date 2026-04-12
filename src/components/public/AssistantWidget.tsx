'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, User, ChevronRight, Mail, Phone, Building2, CheckCircle2, Loader2, Sparkles } from 'lucide-react'

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
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([])
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
      
      const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.text }
      const finalMessages = [...newMessages, assistantMsg]
      setMessages(finalMessages)

      // Si el asistente menciona contacto o agenda, podríamos disparar el formulario
      if (data.text.toLowerCase().includes('contacto') || 
          data.text.toLowerCase().includes('email') ||
          finalMessages.length >= 6) {
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

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto w-[40px] h-[40px] bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform relative group border border-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot size={25} />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="pointer-events-auto absolute bottom-0 right-0 w-[92vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-black/5 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-black tracking-tight leading-tight">DEBUG: Partners Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">En línea</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatParent}
              className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto border border-white">
                    <Sparkles className="text-blue-500" size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-black tracking-tight px-6 leading-tight">
                    Hola, soy tu asistente experto en IA. ¿Cómo puedo ayudarte hoy?
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold px-10 leading-relaxed uppercase tracking-wider">
                    Asesoría en Agentes, RAG y Automatización.
                  </p>
                </div>
              )}

              {messages.map(m => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-[1.25rem] text-[13px] font-medium leading-normal tracking-tight ${
                    m.role === 'user' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-white border border-gray-100 text-black shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white border border-gray-100 px-3 py-2 rounded-full flex gap-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
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
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-8 py-2 text-[11px] focus:outline-none focus:bg-white/20 transition-all font-medium"
                          value={leadData.name}
                          onChange={e => setLeadData({...leadData, name: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                        <input 
                          required type="email"
                          placeholder="Email corporativo"
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-8 py-2 text-[11px] focus:outline-none focus:bg-white/20 transition-all font-medium"
                          value={leadData.email}
                          onChange={e => setLeadData({...leadData, email: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                        <input 
                          placeholder="Empresa"
                          className="w-full bg-white/10 border border-white/10 rounded-xl px-8 py-2 text-[11px] focus:outline-none focus:bg-white/20 transition-all font-medium"
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
                  className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-black/5 shadow-sm"
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
