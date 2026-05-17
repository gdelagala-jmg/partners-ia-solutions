'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Calendar, Upload, X, Loader2, Tag, Plus, Code2, Eye, Zap, Share2, CheckCircle2, FileText, Settings2, Globe, Database, Image as ImageIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

// Dynamic import so SSR doesn't try to load browser-only Quill
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-48 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />,
})

// Quill toolbar config
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ align: [] }],
        ['clean'],
    ],
}

const newsSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    slug: z.string().min(1, 'El slug es obligatorio'),
    content: z.string().min(1, 'El contenido es obligatorio'),
    category: z.string().min(1, 'La categoría es obligatoria'),
    tags: z.string().nullable().optional(),
    aiType: z.string().nullable().optional(),
    businessArea: z.string().nullable().optional(),
    sector: z.string().nullable().optional(),
    profession: z.string().nullable().optional(),
    aiTool: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    podcastAudioUrl: z.string().nullable().optional(),
    published: z.boolean().optional(),
    publishedAt: z.string().optional().nullable(),
})

type NewsFormValues = z.infer<typeof newsSchema>
const CATEGORY_PRESETS = ['Noticia', 'Análisis', 'Tutorial', 'Caso de Estudio', 'Opinión', 'Tendencias']
const AI_TYPES_LIST = ['IA Generativa', 'Machine Learning', 'NLP / PLN', 'Visión Artificial', 'Robótica', 'IA Agéntica']
const BUSINESS_AREAS_LIST = ['Finanzas', 'Salud', 'Educación', 'Retail', 'Manufactura', 'Tecnología', 'Marketing', 'Recursos Humanos', 'Legal']
const SECTORS_LIST = ['Banca', 'Farmacéutica', 'Universidades', 'Ecommerce', 'Automoción', 'Software', 'Legal', 'Educación', 'Alimentación', 'Ocio']
const PROFESSIONS_LIST = ['Ejecutivos', 'Desarrolladores', 'Marketers', 'Médicos', 'Profesores', 'Diseñadores', 'Abogados']
const AI_TOOLS_LIST = ['ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'Copilot', 'Cursor', 'Perplexity', 'Stable Diffusion', 'Whisper', 'DALL-E', 'Sora', 'Llama', 'Grok', 'Runway', 'Flux', 'Mistral']
const COMPANIES_LIST = ['OpenAI', 'Google', 'Microsoft', 'Nvidia', 'Meta', 'Tesla', 'Amazon', 'IBM', 'Apple', 'Anthropic', 'Hugging Face', 'xAI', 'Mistral', 'Cohere', 'Adobe', 'Salesforce']

// --- Chip Input Component ---
function ChipInput({
    label,
    chips,
    onAdd,
    onRemove,
    placeholder,
    presets,
}: {
    label: string
    chips: string[]
    onAdd: (val: string) => void
    onRemove: (val: string) => void
    placeholder?: string
    presets?: string[]
}) {
    const [inputVal, setInputVal] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
            e.preventDefault()
            const val = inputVal.trim().replace(/,$/, '')
            if (val && !chips.includes(val)) onAdd(val)
            setInputVal('')
        }
        if (e.key === 'Backspace' && !inputVal && chips.length) {
            onRemove(chips[chips.length - 1])
        }
    }

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            {/* Presets */}
            {presets && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {presets.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => !chips.includes(p) && onAdd(p)}
                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${chips.includes(p)
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
            {/* Input + chips area */}
            <div className="flex flex-wrap gap-1.5 items-center min-h-[42px] bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                {chips.map(chip => (
                    <span
                        key={chip}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2 py-0.5 text-xs font-semibold"
                    >
                        {chip}
                        <button type="button" onClick={() => onRemove(chip)} className="text-blue-400 hover:text-red-500 transition-colors">
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={chips.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none border-none focus:ring-0"
                />
            </div>
        </div>
    )
}

// --- Selectable Metadata Component ---
function SelectableMetadata({
    label,
    value,
    onChange,
    options,
    onAddOption,
    placeholder = "Escribir..."
}: {
    label: string
    value: string
    onChange: (val: string) => void
    options: string[]
    onAddOption: (val: string) => void
    placeholder?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [localValue, setLocalValue] = useState(value || '')

    useEffect(() => {
        setLocalValue(value || '')
    }, [value])

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(localValue.toLowerCase())
    )

    const handleSelect = (opt: string) => {
        onChange(opt)
        setIsOpen(false)
    }

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setLocalValue(val)
        onChange(val)
        setIsOpen(true)
    }

    return (
        <div className="relative">
            <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={localValue}
                    onChange={handleManualChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    placeholder={placeholder}
                    className="block w-full text-sm bg-gray-50/50 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 shadow-sm transition-all h-10 px-3 pr-8"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                    <Plus size={14} className="text-gray-400" />
                </div>

                {isOpen && (filteredOptions.length > 0 || (localValue && !options.includes(localValue))) && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150">
                        {filteredOptions.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onMouseDown={() => handleSelect(opt)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${value === opt ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                        {localValue && !options.includes(localValue) && (
                            <button
                                key="add-new"
                                type="button"
                                onMouseDown={() => {
                                    onAddOption(localValue)
                                    handleSelect(localValue)
                                }}
                                className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-50 italic"
                            >
                                <Plus size={12} className="inline mr-1" /> Añadir "{localValue}"
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function NewsForm({ initialData, onSubmit, onCancel }: any) {
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [syncSuccess, setSyncSuccess] = useState(false)
    const [analysedFields, setAnalysedFields] = useState<string[]>([])
    const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual')
    const [htmlContent, setHtmlContent] = useState(initialData?.content || '')

    // Stateful lists for metadata
    const [companiesList, setCompaniesList] = useState(COMPANIES_LIST)
    const [aiToolsList, setAiToolsList] = useState(AI_TOOLS_LIST)
    const [aiTypesList, setAiTypesList] = useState(AI_TYPES_LIST)
    const [businessAreasList, setBusinessAreasList] = useState(BUSINESS_AREAS_LIST)
    const [sectorsList, setSectorsList] = useState(SECTORS_LIST)
    const [professionsList, setProfessionsList] = useState(PROFESSIONS_LIST)

    const [categories, setCategories] = useState<string[]>(
        initialData?.category
            ? initialData.category.split(',').map((c: string) => c.trim()).filter(Boolean)
            : ['Noticia']
    )
    const [tags, setTags] = useState<string[]>(
        initialData?.tags
            ? initialData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : []
    )

    const formatDateForInput = (dateString: string | Date | null) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    }

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: initialData ? {
            ...initialData,
            content: initialData.content || '',
            category: initialData.category || 'Noticia',
            publishedAt: formatDateForInput(initialData.publishedAt),
        } : {
            category: 'Noticia',
            content: '',
            published: false,
            publishedAt: null,
        },
    })

    const coverImageUrl = watch('coverImage')
    const company = watch('company')
    const aiTool = watch('aiTool')
    const aiType = watch('aiType')
    const businessArea = watch('businessArea')
    const sector = watch('sector')
    const profession = watch('profession')

    // Keep form value in sync with rich editor
    const handleQuillChange = (val: string) => {
        setHtmlContent(val)
        setValue('content', val)
    }

    // Sync html textarea changes back
    const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHtmlContent(e.target.value)
        setValue('content', e.target.value)
    }

    // --- Smart Analysis Logic ---
    const analyzeContent = useCallback(() => {
        setAnalyzing(true)
        setAnalysedFields([])
        
        setTimeout(() => {
            const titleText = watch('title') || ''
            const textToAnalyze = (titleText + ' ' + htmlContent.replace(/<[^>]*>/g, ' ')).toLowerCase()
            
            const fieldsDetected: string[] = []

            // Mapping Configuration
            const MAPPINGS = {
                aiType: [
                    { label: 'IA Generativa', kw: ['generativa', 'genai', 'gpt', 'generador', 'creación', 'contenido', 'frontera', 'llm', 'openai', 'inteligencia artificial', 'ia', 'exponencial', 'curva'] },
                    { label: 'Machine Learning', kw: ['aprendizaje', 'machine', 'learning', 'predicción', 'datos', 'algoritmo', 'entrenamiento', 'anticipar', 'exponencial'] },
                    { label: 'NLP / PLN', kw: ['lenguaje', 'texto', 'habla', 'nlp', 'pln', 'conversación', 'escritura', 'idioma', 'resumen'] },
                    { label: 'IA Agéntica', kw: ['agente', 'autónomo', 'workflow', 'razonamiento', 'planeación', 'multi-agente', 'autonomía'] },
                    { label: 'Visión Artificial', kw: ['imagen', 'vídeo', 'visión', 'reconocimiento', 'detección', 'video', 'facial', 'objetos'] }
                ],
                businessArea: [
                    { label: 'Finanzas', kw: ['banco', 'ahorro', 'dinero', 'finanzas', 'inversión', 'contabilidad', 'gestión', 'fiscal', 'mercado', 'empresa', 'negocio'] },
                    { label: 'Salud', kw: ['médico', 'hospital', 'salud', 'paciente', 'diagnóstico', 'terapia', 'clínica', 'biotech', 'biología'] },
                    { label: 'Marketing', kw: ['ventas', 'marketing', 'publicidad', 'contenido', 'campaña', 'redes', 'seo', 'growth', 'audiencia', 'cliente'] },
                    { label: 'Tecnología', kw: ['software', 'tecnología', 'tech', 'computación', 'nube', 'cloud', 'digital', 'it', 'sistemas'] },
                    { label: 'Recursos Humanos', kw: ['contratación', 'personal', 'rrhh', 'gestión', 'productividad', 'equipo', 'talento', 'empleo', 'hiring', 'trabajo'] },
                    { label: 'Legal', kw: ['ley', 'abogado', 'legal', 'normativa', 'contrato', 'jurídico', 'compliance', 'regulación'] }
                ],
                sector: [
                    { label: 'Banca', kw: ['banco', 'pagos', 'seguro', 'fraud', 'bancario', 'fintech', 'financiero'] },
                    { label: 'Ecommerce', kw: ['tienda', 'venta', 'carrito', 'retail', 'negocio', 'consumo', 'online', 'tiendas', 'retail'] },
                    { label: 'Software', kw: ['app', 'herramienta', 'saas', 'tecnológico', 'digita', 'plataforma', 'nube', 'devops'] },
                    { label: 'Educación', kw: ['aprendizaje', 'estudiante', 'clase', 'universidad', 'escuela', 'enseñanza', 'formación', 'edtech', 'curso'] },
                    { label: 'Alimentación', kw: ['comida', 'food', 'restaurante', 'bebida', 'agro', 'agrícola', 'nutrición'] },
                    { label: 'Ocio', kw: ['viaje', 'turismo', 'cine', 'deporte', 'entretenimiento', 'ocio', 'gaming'] }
                ],
                professions: [
                    { label: 'Ejecutivos', kw: ['ceo', 'director', 'gestión', 'manager', 'gerente', 'líder', 'estratégica', 'jefe', 'pm', 'product manager', 'owner'] },
                    { label: 'Desarrolladores', kw: ['código', 'programador', 'ingeniero', 'software', 'dev', 'frontend', 'backend', 'fullstack', 'it engineer'] },
                    { label: 'Marketers', kw: ['marketing', 'analista', 'creativo', 'ventas', 'especialista', 'growth', 'comunicación'] },
                    { label: 'Médicos', kw: ['doctor', 'médico', 'paciente', 'enfermero', 'salud', 'clínico', 'cirujano'] },
                    { label: 'Profesores', kw: ['maestro', 'profesor', 'estudiante', 'docente', 'formador', 'tutor', 'mentor'] },
                    { label: 'Abogados', kw: ['abogado', 'legal', 'jurídico', 'consultor', 'notario', 'fiscal'] }
                ],
                aiTool: [
                    { label: 'ChatGPT', kw: ['chatgpt', 'openai', 'gpt-4o', 'gpt-4', 'gpt-3', 'dall-e'] },
                    { label: 'Gemini', kw: ['google', 'gemini', 'gemini pro', 'ultra', 'vertex'] },
                    { label: 'Claude', kw: ['anthropic', 'claude', 'sonnet', 'opus', 'haiku'] },
                    { label: 'Midjourney', kw: ['imagen', 'dibujo', 'diseño', 'midjourney', 'artístico'] },
                    { label: 'Copilot', kw: ['microsoft', 'copilot', 'github'] },
                    { label: 'Cursor', kw: ['editor', 'cursor', 'programar', 'ide'] },
                    { label: 'Perplexity', kw: ['búsqueda', 'search', 'perplexity'] },
                    { label: 'Llama', kw: ['meta', 'llama', 'llama3', 'llama2', 'open-source'] },
                    { label: 'Runway', kw: ['vídeo', 'video', 'runway', 'gen-3', 'gen-2'] },
                    { label: 'Sora', kw: ['sora', 'generación de video', 'openai video'] },
                    { label: 'Mistral', kw: ['mistral', 'mixtral', 'le chat', 'la plateforme'] }
                ],
                company: [
                    { label: 'OpenAI', kw: ['openai', 'sam altman'] },
                    { label: 'Google', kw: ['google', 'alphabet', 'deepmind'] },
                    { label: 'Microsoft', kw: ['microsoft', 'satya nadella'] },
                    { label: 'Nvidia', kw: ['nvidia', 'jensen huang', 'gpu'] },
                    { label: 'Meta', kw: ['meta', 'facebook', 'mark zuckerberg'] },
                    { label: 'Anthropic', kw: ['anthropic', 'dario amodei'] },
                    { label: 'Mistral', kw: ['mistral', 'mistral ai'] },
                    { label: 'xAI', kw: ['xai', 'elon musk'] },
                    { label: 'Amazon', kw: ['amazon', 'aws'] },
                    { label: 'IBM', kw: ['ibm', 'watson'] },
                    { label: 'Apple', kw: ['apple', 'apple intelligence'] },
                    { label: 'Hugging Face', kw: ['hugging face', 'huggingface'] },
                    { label: 'Cohere', kw: ['cohere'] }
                ]
            }

            // Processing Loops
            Object.entries(MAPPINGS).forEach(([field, mapping]) => {
                const targetField = (field === 'professions' ? 'profession' : field) as any
                let match: any = null;

                // Si estamos buscando Herramienta IA, darle extra prioridad a la "fuente" si existe
                if (field === 'aiTool' && textToAnalyze.includes('fuente:')) {
                    const parts = textToAnalyze.split('fuente:');
                    if (parts.length > 1) {
                         const sourceText = parts[1].trim();
                         // 1. Check strict match in the source ONLY
                         match = mapping.find(m => m.kw.some(k => sourceText.includes(k.toLowerCase())));
                    }
                }
                
                // Si no hay match por fuente (o no es aiTool), buscar en todo el texto
                if (!match) {
                    match = mapping.find(m => m.kw.some(k => textToAnalyze.includes(k.toLowerCase())));
                }

                if (match) {
                    setValue(targetField, match.label, { shouldDirty: true, shouldValidate: true })
                    fieldsDetected.push(match.label)
                }
            })

            // Meta Tags & Categories
            const newCats = [...categories]
            CATEGORY_PRESETS.forEach(cat => {
                if (textToAnalyze.includes(cat.toLowerCase()) && !newCats.includes(cat)) {
                    newCats.push(cat)
                    fieldsDetected.push(cat)
                }
            })
            if (newCats.length > categories.length) setCategories(newCats)

            const commonTerms = ['OpenAI', 'Google', 'Microsoft', 'Nvidia', 'Meta', 'Tesla', 'Amazon', 'IBM', 'Apple', 'Anthropic', 'Hugging Face', 'xAI', 'Mistral', 'Cohere', 'Startups', 'Innovación']
            const newTags = [...tags]
            commonTerms.forEach(term => {
                if (textToAnalyze.includes(term.toLowerCase()) && !newTags.includes(term)) {
                    newTags.push(term)
                    fieldsDetected.push(term)
                }
            })
            setTags(newTags)
            
            setAnalysedFields(fieldsDetected)
            setAnalyzing(false)
        }, 600)
    }, [htmlContent, watch, categories, tags, setValue])

    // --- Auto-Analysis on Paste ---
    const lastContentLength = useRef(htmlContent.length)
    useEffect(() => {
        const currentLength = htmlContent.length
        if (currentLength > 200 && lastContentLength.current < 50) {
            analyzeContent()
        }
        lastContentLength.current = currentLength
    }, [htmlContent, analyzeContent])

    // Sync categories to form field
    useEffect(() => {
        setValue('category', categories.join(', ') || 'Noticia')
    }, [categories, setValue])

    const handleTitleChange = (e: any) => {
        if (!initialData) {
            const slugVal = e.target.value.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-').replace(/[^\w-]+/g, '')
            setValue('slug', slugVal)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')
            setValue('coverImage', data.url, { shouldDirty: true, shouldValidate: true })
        } catch (err: any) {
            alert(err.message || 'Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')
            setValue('coverImage', data.url, { shouldDirty: true, shouldValidate: true })
        } catch (err: any) {
            alert(err.message || 'Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    // --- Sync to Google Business Manual Trigger ---
    const handleManualSync = async () => {
        if (!initialData?.id) return
        setSyncing(true)
        setSyncSuccess(false)
        try {
            const res = await fetch(`/api/news/${initialData.id}/sync`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Sync failed')
            setSyncSuccess(true)
            setTimeout(() => setSyncSuccess(false), 3000)
        } catch (err: any) {
            alert('Error al sincronizar: ' + err.message)
        } finally {
            setSyncing(false)
        }
    }

    // Inject quill css once
    useEffect(() => {
        const id = 'quill-css'
        if (!document.getElementById(id)) {
            const link = document.createElement('link')
            link.id = id
            link.rel = 'stylesheet'
            link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css'
            document.head.appendChild(link)
        }
    }, [])

    const onError = (errors: any) => {
        console.error('Validation errors:', errors)
        const errorMessages = Object.values(errors).map((err: any) => err.message).join('\n')
        alert(`No se puede guardar la noticia. Corrige lo siguiente:\n${errorMessages}`)
    }

    const handleFormSubmit = (data: NewsFormValues) => {
        const sanitizedData = {
            ...data,
            content: htmlContent,
            category: categories.join(', ') || 'Noticia',
            tags: tags.join(', '),
            publishedAt: data.publishedAt || null
        }
        onSubmit(sanitizedData)
    }

    return (
        <AdminFormShell
            title={initialData ? 'Editar Noticia' : 'Nueva Noticia'}
            description={initialData ? `ID: ${initialData.id}` : 'Publica contenido de actualidad sobre IA'}
            onCancel={onCancel}
            onSubmit={handleSubmit(handleFormSubmit, onError)}
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Actualizar Noticia' : 'Publicar Noticia'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Contenido Principal">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Título de la Noticia</label>
                                <input
                                    {...register('title')}
                                    onChange={(e) => {
                                        register('title').onChange(e);
                                        handleTitleChange(e);
                                    }}
                                    placeholder="Ej: Google lanza Gemini 1.5 Pro..."
                                    className="block w-full bg-gray-50/50 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 shadow-sm transition-all h-12 px-4 text-lg font-bold"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL amigable)</label>
                                <div className="relative">
                                    <input
                                        {...register('slug')}
                                        placeholder="google-lanza-gemini-pro"
                                        className="block w-full bg-gray-50/50 border-gray-200 rounded-xl text-gray-500 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 shadow-sm transition-all h-10 px-3 pl-8 font-mono text-xs"
                                    />
                                    <Globe className="absolute left-2.5 top-3 text-gray-400" size={14} />
                                </div>
                                {errors.slug && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.slug.message}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Cuerpo de la Noticia</label>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setEditorMode('visual')}
                                            className={cn(
                                                "px-3 py-1 text-[11px] font-bold rounded-md transition-all",
                                                editorMode === 'visual' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                            )}
                                        >
                                            Visual
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditorMode('html')}
                                            className={cn(
                                                "px-3 py-1 text-[11px] font-bold rounded-md transition-all",
                                                editorMode === 'html' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                            )}
                                        >
                                            HTML
                                        </button>
                                    </div>
                                </div>
                                
                                {editorMode === 'visual' ? (
                                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                                        <ReactQuill
                                            theme="snow"
                                            value={htmlContent}
                                            onChange={handleQuillChange}
                                            modules={quillModules}
                                            className="min-h-[400px]"
                                        />
                                    </div>
                                ) : (
                                    <textarea
                                        value={htmlContent}
                                        onChange={handleHtmlChange}
                                        rows={18}
                                        spellCheck={false}
                                        className="block w-full bg-gray-900 text-blue-100 border border-gray-800 rounded-xl font-mono text-sm p-5 focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="<!-- Código HTML -->"
                                    />
                                )}
                                {errors.content && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.content.message}</p>}
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Multimedia y Podcast">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Imagen de Portada</label>
                                <div
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-3 overflow-hidden group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                                    onClick={() => document.getElementById('cover-upload')?.click()}
                                >
                                    {coverImageUrl ? (
                                        <>
                                            <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur p-2 rounded-full text-gray-900 shadow-xl">
                                                    <Upload size={20} />
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); setValue('coverImage', ''); }}
                                                className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                                                {uploading ? <Loader2 className="animate-spin" size={28} /> : <ImageIcon size={28} />}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-gray-700">{uploading ? 'Subiendo...' : 'Subir Imagen'}</p>
                                                <p className="text-[11px] text-gray-400">O arrastra y suelta aquí</p>
                                            </div>
                                        </>
                                    )}
                                    <input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-start gap-4">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-600">
                                        <Zap size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-indigo-900 mb-1">Audio Podcast (NotebookLM)</label>
                                        <input
                                            {...register('podcastAudioUrl')}
                                            placeholder="URL de audio o resumen..."
                                            className="block w-full bg-white border-indigo-100 rounded-lg shadow-sm text-indigo-900 focus:ring-indigo-500 text-sm h-10 px-3"
                                        />
                                        <p className="text-[11px] text-indigo-600/70 mt-2 leading-relaxed">
                                            Al guardar, el sistema procesará este enlace para distribuirlo automáticamente a Spotify.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <AdminCard title="Publicación" headerClassName="bg-gray-50/50">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between p-3 bg-blue-50/30 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full animate-pulse",
                                        watch('published') ? "bg-green-500" : "bg-gray-300"
                                    )} />
                                    <label htmlFor="published" className="text-sm font-bold text-gray-700 cursor-pointer">Visibilidad Pública</label>
                                </div>
                                <input
                                    type="checkbox"
                                    id="published"
                                    {...register('published')}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Fecha Programada</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        {...register('publishedAt')}
                                        className="block w-full bg-gray-50/50 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 shadow-sm transition-all h-10 px-3 pl-10 text-sm"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Categorización" headerClassName="bg-gray-50/50">
                        <div className="space-y-6">
                            <ChipInput
                                label="Categorías"
                                chips={categories}
                                onAdd={val => setCategories([...categories, val])}
                                onRemove={val => setCategories(categories.filter(c => c !== val))}
                                presets={CATEGORY_PRESETS}
                                placeholder="Añadir categoría..."
                            />

                            <ChipInput
                                label="Tags / Etiquetas"
                                chips={tags}
                                onAdd={val => setTags([...tags, val])}
                                onRemove={val => setTags(tags.filter(t => t !== val))}
                                placeholder="Añadir tag..."
                            />
                        </div>
                    </AdminCard>

                    <AdminCard title="IA Insight" headerClassName="bg-blue-50/50">
                        <div className="space-y-4">
                            <div className="flex gap-2 mb-2">
                                <button
                                    type="button"
                                    onClick={analyzeContent}
                                    disabled={analyzing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-white" />}
                                    {analyzing ? 'Analizando...' : 'Auto-Mapeo IA'}
                                </button>

                                {initialData?.id && (
                                    <button
                                        type="button"
                                        onClick={handleManualSync}
                                        disabled={syncing}
                                        title="Sincronizar con Google Business"
                                        className={cn(
                                            "p-2.5 rounded-xl border transition-all",
                                            syncSuccess ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {syncing ? <Loader2 size={16} className="animate-spin" /> : syncSuccess ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <SelectableMetadata
                                    label="Empresa"
                                    value={company || ''}
                                    onChange={val => setValue('company', val, { shouldDirty: true })}
                                    options={companiesList}
                                    onAddOption={val => setCompaniesList(prev => [...prev, val])}
                                />
                                <SelectableMetadata
                                    label="Herramienta"
                                    value={aiTool || ''}
                                    onChange={val => setValue('aiTool', val, { shouldDirty: true })}
                                    options={aiToolsList}
                                    onAddOption={val => setAiToolsList(prev => [...prev, val])}
                                />
                                <SelectableMetadata
                                    label="Tipo IA"
                                    value={aiType || ''}
                                    onChange={val => setValue('aiType', val, { shouldDirty: true })}
                                    options={aiTypesList}
                                    onAddOption={val => setAiTypesList(prev => [...prev, val])}
                                />
                                <SelectableMetadata
                                    label="Área"
                                    value={businessArea || ''}
                                    onChange={val => setValue('businessArea', val, { shouldDirty: true })}
                                    options={businessAreasList}
                                    onAddOption={val => setBusinessAreasList(prev => [...prev, val])}
                                />
                                <SelectableMetadata
                                    label="Sector"
                                    value={sector || ''}
                                    onChange={val => setValue('sector', val, { shouldDirty: true })}
                                    options={sectorsList}
                                    onAddOption={val => setSectorsList(prev => [...prev, val])}
                                />
                                <SelectableMetadata
                                    label="Profesión"
                                    value={profession || ''}
                                    onChange={val => setValue('profession', val, { shouldDirty: true })}
                                    options={professionsList}
                                    onAddOption={val => setProfessionsList(prev => [...prev, val])}
                                />
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
