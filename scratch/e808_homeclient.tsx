commit e808fd662300e6680105be6ed58464b6dd3f7997
Author: Admin <admin@partners-ia.com>
Date:   Wed Apr 8 20:59:51 2026 +0200

    feat: redesign solutions & clients sections with standard spacing
    
    - Remove breadcrumbs from public layout (visual conflict)
    - Standardize solutions section: gap-6, p-5, rounded-2xl, mb-8
    - Redesign ClientCarousel: gray-100 cards, CSS marquee animation
    - Section 'Listo para escalar': white bg, blue badge, stats row
    - Add clients-marquee keyframe animation to globals.css

diff --git a/src/app/(public)/(main)/HomeClient.tsx b/src/app/(public)/(main)/HomeClient.tsx
index 8085104..f815366 100644
--- a/src/app/(public)/(main)/HomeClient.tsx
+++ b/src/app/(public)/(main)/HomeClient.tsx
@@ -103,50 +103,48 @@ export default function HomeClient({ initialSectors }: HomeClientProps) {
             </section>
 
             {/* FEATURED SOLUTIONS SECTION */}
-            <section className="py-8 lg:py-8 bg-gray-50 border-b border-gray-100">
+            <section className="py-8 bg-gray-50 border-b border-gray-100">
                 <div className="max-w-7xl mx-auto px-6 lg:px-8">
-                    <div className="text-center mb-12 px-4">
+                    <div className="text-center mb-8">
                         <PageBadge text="Nuestras Soluciones" icon={<Target size={14} className="text-blue-500" />} />
-                        <h2 className="text-3xl md:text-4xl font-semibold text-[#000000] mb-4 tracking-tight">
+                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                             Soluciones Destacadas
                         </h2>
-                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
+                        <p className="text-sm text-gray-600 max-w-xl mx-auto">
                             Ecosistemas de Inteligencia Artificial diseñados para resolver los retos específicos de tu industria
                         </p>
                     </div>
 
                     {initialSectors.length === 0 ? (
-                        <div className="text-center text-gray-500 bg-white py-8 rounded-3xl border border-gray-100">Pronto publicaremos nuestras soluciones especializadas.</div>
+                        <div className="text-center text-gray-500 bg-white py-8 rounded-2xl border border-gray-100">Pronto publicaremos nuestras soluciones especializadas.</div>
                     ) : (
-                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
+                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {initialSectors.map((sector) => (
                                 <Link
                                     key={sector.id}
                                     href={`/soluciones/${sector.slug}`}
-                                    className="group flex flex-col h-[400px] md:h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-200 bg-white relative"
+                                    className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-200 bg-white"
                                 >
-                                    <div className="h-[55%] w-full relative overflow-hidden bg-gray-100">
+                                    <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                                         <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                         <img
                                             src={getSectorImage(sector)}
                                             alt={`Soluciones IA para ${sector.name}`}
                                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                         />
-                                        <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20">
-                                            <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/95 backdrop-blur-md text-xs md:text-sm font-semibold rounded-xl shadow-sm text-black border border-white/20">
+                                        <div className="absolute top-3 left-3 z-20">
+                                            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-xs font-semibold rounded-xl shadow-sm text-black border border-white/20">
                                                 {sector.name}
                                             </span>
                                         </div>
                                     </div>
-                                    <div className="h-[45%] p-5 md:p-6 lg:p-8 flex flex-col justify-between bg-white relative z-20">
-                                        <div>
-                                            <p className="text-gray-600 line-clamp-3 leading-relaxed text-[14px] md:text-[15px]">
-                                                {sector.description || `Descubre cómo la IA automatiza tus operaciones y mejora las métricas del sector ${sector.name}.`}
-                                            </p>
-                                        </div>
-                                        <div className="flex items-center text-[14px] md:text-[15px] font-semibold text-blue-600 group-hover:text-black transition-colors">
+                                    <div className="p-5 flex flex-col flex-1 justify-between bg-white">
+                                        <p className="text-gray-600 line-clamp-3 leading-relaxed text-sm mb-4">
+                                            {sector.description || `Descubre cómo la IA automatiza tus operaciones y mejora las métricas del sector ${sector.name}.`}
+                                        </p>
+                                        <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-black transition-colors">
                                             Descubrir Soluciones
-                                            <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
+                                            <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                                         </div>
                                     </div>
                                 </Link>
@@ -154,41 +152,57 @@ export default function HomeClient({ initialSectors }: HomeClientProps) {
                         </div>
                     )}
 
-                    <div className="mt-12 text-center">
+                    <div className="mt-8 text-center">
                         <Link
                             href="/soluciones"
-                            className="inline-flex items-center px-8 py-3 bg-white text-black font-bold rounded-2xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
+                            className="inline-flex items-center px-6 py-2.5 bg-white text-gray-900 font-medium text-sm rounded-xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
                         >
                             Ver Todas las Soluciones
-                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
+                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                         </Link>
                     </div>
                 </div>
             </section>
 
+
             <PodcastHomeSection />
             <LatestNewsSection />
 
-            <section className="py-8 lg:py-8 bg-white">
-                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
-                    <motion.div
-                        initial={{ opacity: 0, y: 20 }}
-                        whileInView={{ opacity: 1, y: 0 }}
-                        viewport={{ once: true }}
-                        transition={{ duration: 0.6 }}
-                    >
-                        <PageBadge text="Próximos Pasos" icon={<Sparkles size={14} className="text-blue-500" />} />
-                        <h2 className="text-3xl md:text-4xl font-semibold text-[#000000] mb-4 tracking-tight">
-                            ¿Listo para escalar?
-                        </h2>
-                        <p className="text-base text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed">
-                            Únete a las empresas que ya están utilizando nuestros agentes de IA para reducir costes y multiplicar ingresos.
-                        </p>
-                        <ClientCarousel />
-                    </motion.div>
+            <section className="pt-6 pb-10 bg-white border-t border-gray-100">
+                <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
+                    {/* Badge */}
+                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-5">
+                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
+                        Próximos Pasos
+                    </div>
+
+                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 tracking-tight leading-tight">
+                        ¿Listo para escalar?
+                    </h2>
+                    <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
+                        Únete a las empresas que ya utilizan nuestros agentes de IA para reducir costes y multiplicar ingresos.
+                    </p>
+
+                    {/* Stats row */}
+                    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto mb-10">
+                        {[
+                            { value: '+60%', label: 'Reducción de costes' },
+                            { value: '3×', label: 'Captación más rápida' },
+                            { value: '+120%', label: 'Más ingresos' },
+                        ].map((stat) => (
+                            <div key={stat.label} className="flex flex-col items-center gap-0.5">
+                                <span className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</span>
+                                <span className="text-[10px] text-gray-400 leading-tight text-center">{stat.label}</span>
+                            </div>
+                        ))}
+                    </div>
+
+                    {/* Client logos carousel */}
+                    <ClientCarousel />
                 </div>
             </section>
 
+
             <LeadCaptureSection />
         </div>
     )
