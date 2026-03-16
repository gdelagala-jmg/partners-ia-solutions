'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Calendar, Upload, X, Loader2, Tag, Plus, Code2, Eye, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'

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
    coverImage: z.string().nullable().optional(),
    published: z.boolean().optional(),
    publishedAt: z.string().optional().nullable(),
})

type NewsFormValues = z.infer<typeof newsSchema>

const CATEGORY_PRESETS = ['Noticia', 'Análisis', 'Tutorial', 'Caso de Estudio', 'Opinión', 'Tendencias']
const aiTypes = ['Generative AI', 'Machine Learning', 'NLP', 'Computer Vision', 'Robotics', 'Agentic AI']
const businessAreas = ['Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Technology']
const sectors = ['Banking', 'Pharma', 'Universities', 'Ecommerce', 'Automotive', 'Software']
const professions = ['Executives', 'Developers', 'Marketers', 'Doctors', 'Teachers', 'Designers']

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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            {/* Presets */}
            {presets && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {presets.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => !chips.includes(p) && onAdd(p)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${chips.includes(p)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
            {/* Input + chips area */}
            <div className="flex flex-wrap gap-1.5 items-center min-h-[42px] bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                {chips.map(chip => (
                    <span
                        key={chip}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                        {chip}
                        <button type="button" onClick={() => onRemove(chip)} className="text-blue-400 hover:text-red-500 transition-colors">
                            <X size={11} />
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
            <p className="text-xs text-gray-400 mt-1">Pulsa Enter o coma para añadir</p>
        </div>
    )
}

export default function NewsForm({ initialData, onSubmit, onCancel }: any) {
    const [uploading, setUploading] = useState(false)
    const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual')
    const [htmlContent, setHtmlContent] = useState(initialData?.content || '')
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
        const text = htmlContent.replace(/<[^>]*>/g, ' ').toLowerCase()
        
        // 1. Detect AI Types
        const detectedAiType = aiTypes.find(t => text.includes(t.toLowerCase()))
        if (detectedAiType) setValue('aiType', detectedAiType)

        // 2. Detect Business Areas
        const detectedArea = businessAreas.find(a => text.includes(a.toLowerCase()))
        if (detectedArea) setValue('businessArea', detectedArea)

        // 3. Detect Sectors
        const detectedSector = sectors.find(s => text.includes(s.toLowerCase()))
        if (detectedSector) setValue('sector', detectedSector)

        // 4. Detect Professions
        const detectedProf = professions.find(p => text.includes(p.toLowerCase()))
        if (detectedProf) setValue('profession', detectedProf)

        // 5. Detect Categories from presets
        const newCats = [...categories]
        CATEGORY_PRESETS.forEach(cat => {
            if (text.includes(cat.toLowerCase()) && !newCats.includes(cat)) {
                newCats.push(cat)
            }
        })
        if (newCats.length > categories.length) setCategories(newCats)

        // 6. Generate tags based on common IA and business terms
        const commonTerms = [
            'OpenAI', 'Google', 'Microsoft', 'Nvidia', 'Meta', 'Tesla', 'Amazon',
            'SaaS', 'B2B', 'B2C', 'Startups', 'Productividad', 'Automatización',
            'Eficiencia', 'Inversión', 'Futuro', 'Ética', 'Seguridad', 'Cloud',
            'Data', 'Agentes', 'LLM', 'GPT', 'Innovación', 'Transformación Digital'
        ]
        const newTags = [...tags]
        commonTerms.forEach(term => {
            if (text.includes(term.toLowerCase()) && !newTags.includes(term)) {
                newTags.push(term)
            }
        })
        setTags(newTags)
    }, [htmlContent, categories, tags, setValue])

    // --- Auto-Analysis on Paste ---
    const lastContentLength = useRef(htmlContent.length)
    useEffect(() => {
        const currentLength = htmlContent.length
        // If content jumps significantly (more than 200 chars), it's likely a paste
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
            setValue('coverImage', data.url)
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
            setValue('coverImage', data.url)
        } catch (err: any) {
            alert(err.message || 'Error al subir la imagen')
        } finally {
            setUploading(false)
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
        // Sanitize publishedAt: if it's an empty string, send as null
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
        <form onSubmit={handleSubmit(handleFormSubmit, onError)} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            {/* Title + Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        {...register('title')}
                        onChange={(e) => { register('title').onChange(e); handleTitleChange(e) }}
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                    <input
                        {...register('slug')}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
            </div>

            {/* Categories + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChipInput
                    label="Categorías"
                    chips={categories}
                    onAdd={v => setCategories(prev => [...prev, v])}
                    onRemove={v => setCategories(prev => prev.filter(c => c !== v))}
                    placeholder="Escribe una categoría..."
                    presets={CATEGORY_PRESETS}
                />
                <ChipInput
                    label="Etiquetas"
                    chips={tags}
                    onAdd={v => setTags(prev => [...prev, v])}
                    onRemove={v => setTags(prev => prev.filter(t => t !== v))}
                    placeholder="Escribe una etiqueta..."
                />
            </div>

            {/* Date + Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Publicación</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="datetime-local"
                            {...register('publishedAt')}
                            className="pl-10 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Dejar en blanco para usar la fecha actual al publicar.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Destacada</label>
                    <div className="space-y-3">
                        <input
                            {...register('coverImage')}
                            placeholder="https://..."
                            className="block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 text-sm"
                        />
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                            className="flex items-center gap-2"
                        >
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-gray-300">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploading ? 'Subiendo...' : 'Subir imagen'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                            <span className="text-xs text-gray-500">o arrastra un archivo aquí</span>
                        </div>
                        {coverImageUrl && (
                            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Error')} />
                                <button type="button" onClick={() => setValue('coverImage', '')}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Meta Tags */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Tipo de IA</label>
                    <select {...register('aiType')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {aiTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Área Negocio</label>
                    <select {...register('businessArea')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {businessAreas.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Sector</label>
                    <select {...register('sector')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {sectors.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Profesión</label>
                    <select {...register('profession')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {professions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Content Editor — Visual / HTML toggle */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-700">Contenido</label>
                        <button
                            type="button"
                            onClick={analyzeContent}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                            <Zap size={12} className="fill-blue-600" /> Autogenerar Categorías/Etiquetas
                        </button>
                    </div>
                    {/* Toggle tabs */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
                        <button
                            type="button"
                            onClick={() => setEditorMode('visual')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${editorMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Eye size={13} /> Visual
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditorMode('html')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${editorMode === 'html' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Code2 size={13} /> HTML
                        </button>
                    </div>
                </div>

                {editorMode === 'visual' ? (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                        <ReactQuill
                            theme="snow"
                            value={htmlContent}
                            onChange={handleQuillChange}
                            modules={quillModules}
                            style={{ minHeight: '280px', background: 'white' }}
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <textarea
                            value={htmlContent}
                            onChange={handleHtmlChange}
                            rows={14}
                            spellCheck={false}
                            className="block w-full bg-gray-950 text-green-300 border border-gray-700 rounded-lg shadow-sm font-mono text-[13px] p-4 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            placeholder="<!-- Escribe o pega HTML aquí -->"
                        />
                        <span className="absolute top-2 right-3 text-[10px] text-gray-500 font-mono select-none">HTML</span>
                    </div>
                )}
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>

            {/* Publish + Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        {...register('published')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                        Publicar inmediatamente
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Noticia'}
                    </button>
                </div>
            </div>
        </form>
    )
}
