import { prisma } from '@/lib/prisma'
import { CheckCircle2, AlertCircle, Inbox } from 'lucide-react'
import Link from 'next/link'

export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    let success = false
    let error = null

    try {
        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { unsubscribeToken: token }
        })

        if (subscriber) {
            await prisma.newsletterSubscriber.update({
                where: { id: subscriber.id },
                data: { isActive: false }
            })
            success = true
        } else {
            error = "No hemos encontrado tu suscripción o el enlace no es válido."
        }
    } catch (e) {
        error = "Ha ocurrido un error al procesar tu baja. Por favor, inténtalo más tarde."
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center border border-gray-100">
                {success ? (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Baja completada</h1>
                            <p className="text-gray-500 font-medium">Te has dado de baja correctamente de nuestra newsletter. Sentimos que te vayas.</p>
                        </div>
                        <div className="pt-4">
                            <Link href="/" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
                                Volver a la web
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500">
                            <AlertCircle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Vaya, algo ha fallado</h1>
                            <p className="text-gray-500 font-medium">{error}</p>
                        </div>
                        <div className="pt-4">
                            <Link href="/" className="inline-block px-8 py-3 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                                Ir al inicio
                            </Link>
                        </div>
                    </div>
                )}
                
                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-300 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <Inbox size={12} />
                    <span>Partners IA Solutions</span>
                </div>
            </div>
        </div>
    )
}
