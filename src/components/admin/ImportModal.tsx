'use client'

import { useState } from 'react'
import { X, Upload, CheckCircle2, AlertCircle, FileArchive, Loader2 } from 'lucide-react'

interface ImportModalProps {
    onClose: () => void
    onSuccess: () => void
}

export default function ImportModal({ onClose, onSuccess }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && (selectedFile.name.endsWith('.zip') || selectedFile.name.endsWith('.dat') || selectedFile.name.endsWith('.json'))) {
            setFile(selectedFile)
            setError(null)
        } else {
            setError('Por favor selecciona un archivo .zip, .dat o .json válido')
            setFile(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/news/import', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (res.ok) {
                setResult(data.results)
                if (data.results.success > 0) {
                    onSuccess()
                }
            } else {
                setError(data.error || 'Error al importar el archivo')
            }
        } catch (err) {
            setError('Error de conexión con el servidor')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <FileArchive className="mr-2 text-cyan-400" size={24} />
                        Importar desde WordPress
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {!result ? (
                        <div className="space-y-6">
                            <p className="text-gray-400 text-sm">
                                Selecciona un archivo <strong>.zip</strong> (con .dat e imágenes), un archivo <strong>.dat</strong> o un archivo <strong>.json</strong> individual.
                            </p>

                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-gray-800 hover:border-gray-700'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept=".zip,.dat,.json"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="import-file"
                                    disabled={uploading}
                                />
                                <label htmlFor="import-file" className="cursor-pointer block">
                                    <Upload className={`mx-auto mb-4 ${file ? 'text-cyan-400' : 'text-gray-500'}`} size={40} />
                                    <span className="text-sm font-medium text-gray-300 block">
                                        {file ? file.name : 'Haz clic para seleccionar archivo'}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1 block">Tamaño máximo: 50MB</span>
                                </label>
                            </div>

                            {error && (
                                <div className="flex items-center p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
                                    <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="flex space-x-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-800 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                    disabled={uploading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    className="flex-1 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                            Importando...
                                        </>
                                    ) : (
                                        'Comenzar Importación'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <CheckCircle2 className="mx-auto text-green-500 mb-4" size={50} />
                                <h3 className="text-lg font-bold text-white">¡Importación Finalizada!</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
                                    <div className="text-2xl font-bold text-green-400">{result.success}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Exitosos</div>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
                                    <div className="text-2xl font-bold text-gray-300">{result.skipped}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Omitidos</div>
                                </div>
                            </div>

                            {result.errors.length > 0 && (
                                <div className="max-h-32 overflow-y-auto p-3 bg-red-900/10 border border-red-900/30 rounded-lg">
                                    <div className="text-xs font-bold text-red-400 mb-1 uppercase">Errores:</div>
                                    {result.errors.map((err: string, i: number) => (
                                        <div key={i} className="text-[10px] text-red-300 mb-1">• {err}</div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                Cerrar y Ver Resultados
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
