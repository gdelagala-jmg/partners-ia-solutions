export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-8 lg:px-8">
        <div className="space-y-8 text-gray-700">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 text-center">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-500 text-center mb-12">
              Cómo protegemos y tratamos tus datos personales, de acuerdo al RGPD.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">1. Responsable del Tratamiento</h2>
            <p>
              De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 (RGPD) y en la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), te informamos de que los datos personales que nos facilites serán tratados por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Razón Social:</strong> Partners IA Solutions S.L.</li>
              <li><strong>CIF:</strong> 12345678Z</li>
              <li><strong>Dirección:</strong> Calle Club 1 Oficina 4 48930 Las Arenas Getxo - Bizkaia</li>
              <li><strong>Email de contacto:</strong> <a href="mailto:info@partnersiasolutions.com" className="text-blue-600 hover:underline">info@partnersiasolutions.com</a></li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">2. Finalidad del Tratamiento</h2>
            <p>
              En Partners IA Solutions S.L. tratamos la información que nos facilitan las personas interesadas con el fin de gestionar el envío de la información que nos soliciten, proveer servicios relacionados con la Inteligencia Artificial, enviar boletines informativos o noticias y comunicaciones comerciales relativas a los servicios que ofrecemos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">3. Legitimación para el Tratamiento de sus Datos</h2>
            <p>
              La base legal para el tratamiento de tus datos es el <strong>consentimiento del interesado</strong>. La oferta prospectiva de productos y servicios está basada en el consentimiento que se te solicita, sin que en ningún caso la retirada de este consentimiento condicione el uso de la página web.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">4. Destinatarios de los Datos</h2>
            <p>
              Salvo obligación legal, los datos no se cederán a terceros ajenos a Partners IA Solutions S.L. sin tu consentimiento expreso, excepto a proveedores de servicios de alojamiento web u otros proveedores tecnológicos necesarios para el correcto funcionamiento de esta página y de los servicios ofrecidos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">5. Conservación de los Datos</h2>
            <p>
              Los datos personales proporcionados se conservarán mientras no se solicite su supresión por el interesado, y en cualquier caso durante los años necesarios para cumplir con las obligaciones legales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">6. Derechos de los Interesados</h2>
            <p>
              Cualquier persona tiene derecho a obtener confirmación sobre si en Partners IA Solutions S.L. estamos tratando datos personales que les conciernan o no. Las personas interesadas tienen derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a sus datos personales.</li>
              <li>Solicitar la rectificación de datos inexactos o, en su caso, solicitar su supresión.</li>
              <li>Solicitar la limitación de su tratamiento.</li>
              <li>Oponerse al tratamiento.</li>
              <li>A la portabilidad de los datos.</li>
            </ul>
            <p>
              Para ejercer tus derechos, puedes enviar un correo electrónico a <a href="mailto:info@partnersiasolutions.com" className="text-blue-600 hover:underline">info@partnersiasolutions.com</a>, indicando el derecho que deseas ejercer y adjuntando una copia de tu DNI o documento equivalente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">7. Reclamación ante la Autoridad de Control</h2>
            <p>
              Si consideras que no hemos tratado tus datos adecuadamente o no hemos atendido tu solicitud de ejercicio de derechos, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.aepd.es</a>).
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
