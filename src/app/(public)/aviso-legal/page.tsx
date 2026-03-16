export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-8 lg:px-8">
        <div className="space-y-8 text-gray-700">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 text-center">
              Aviso Legal
            </h1>
            <p className="text-lg text-gray-500 text-center mb-12">
              Información general aplicable al uso de Partners IA Solutions.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">1. Datos Identificativos</h2>
            <p>
              En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), a continuación se reflejan los siguientes datos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Razón Social:</strong> Partners IA Solutions S.L.</li>
              <li><strong>CIF:</strong> 12345678Z</li>
              <li><strong>Dirección:</strong> Calle Club 1 Oficina 4 48930 Las Arenas Getxo - Bizkaia</li>
              <li><strong>Email:</strong> <a href="mailto:info@partnersiasolutions.com" className="text-blue-600 hover:underline">info@partnersiasolutions.com</a></li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">2. Usuarios</h2>
            <p>
              El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">3. Uso del Portal</h2>
            <p>
              La web proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a Partners IA Solutions S.L. o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
            </p>
            <p>
              El USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que Partners IA Solutions S.L. ofrece a través de su portal y con carácter enunciativo pero no limitativo, a no emplearlos para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.</li>
              <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos.</li>
              <li>Provocar daños en los sistemas físicos y lógicos de Partners IA Solutions S.L., de sus proveedores o de terceras personas.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">4. Propiedad Intelectual e Industrial</h2>
            <p>
              Partners IA Solutions S.L. por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
            </p>
            <p>
              Todos los derechos reservados. En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de Partners IA Solutions S.L..
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">5. Exclusión de Garantías y Responsabilidad</h2>
            <p>
              Partners IA Solutions S.L. no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">6. Modificaciones</h2>
            <p>
              Partners IA Solutions S.L. se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">7. Legislación Aplicable y Jurisdicción</h2>
            <p>
              La relación entre Partners IA Solutions S.L. y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Bizkaia.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
