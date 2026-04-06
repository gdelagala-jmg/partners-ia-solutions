'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="group bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-[15px] md:text-[17px] font-semibold text-black tracking-tight leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-black'
          }`}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-medium">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
