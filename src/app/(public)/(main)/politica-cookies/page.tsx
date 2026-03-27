'use client'

import PageBadge from '@/components/ui/PageBadge'

export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-8 lg:px-8">
        <div className="flex justify-center">
            <PageBadge text="Cookies" />
        </div>
        <div className="space-y-8 text-gray-700">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 text-center">
              Política de Cookies
            </h1>
            <p className="text-lg text-gray-500 text-center mb-12">
              Información sobre el uso de cookies en Partners IA Solutions.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">1. ¿Qué son las cookies?</h2>
            <p>
              Una cookie es un pequeño archivo de texto que un sitio web almacena en su ordenador o dispositivo móvil cuando usted visita sitios concretos.
              Las cookies permiten al sitio web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">2. Cookies que utilizamos</h2>
            <p>
              En la página web de Partners IA Solutions S.L. utilizamos los siguientes tipos de cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan. Por ejemplo, controlar el tráfico y la comunicación de datos, identificar la sesión, o acceder a partes de acceso restringido.</li>
              <li><strong>Cookies de análisis:</strong> Son aquellas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado. Para ello se analiza su navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que le ofrecemos.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">3. Terceros y servicios externos</h2>
            <p>
              Algunas cookies podrían ser instaladas por servicios de terceros que utilizamos en la web para analítica o visualización de contenidos externos. Puedes encontrar más detalles sobre las prácticas de privacidad de cada tercero en sus respectivas páginas de política de privacidad.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">4. Cómo gestionar y desactivar las cookies</h2>
            <p>
              Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en tu ordenador. A continuación, te proporcionamos los enlaces de los principales navegadores:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
            </ul>
            <p>
              Ten en cuenta que si bloqueas todas las cookies o determinadas cookies esenciales, es posible que algunas funciones de nuestra web no funcionen correctamente y no puedas aprovechar al máximo nuestros servicios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">5. Actualizaciones de la Política de Cookies</h2>
            <p>
              Partners IA Solutions S.L. puede modificar esta Política de Cookies en función de nuevas exigencias legislativas, reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos. Te recomendamos visitar esta página de forma periódica.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
