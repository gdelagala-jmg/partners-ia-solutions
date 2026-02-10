import React from 'react';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* HERO SECTION */}
      <header style={{ textAlign: 'center', padding: '100px 20px', background: 'linear-gradient(to bottom, #1e3a8a33, transparent)' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '20px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Partners IA Solutions
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: '#94a3b8' }}>
          Impulsamos el futuro de tu empresa con soluciones de Inteligencia Artificial a medida.
        </p>
        <div style={{ marginTop: '40px' }}>
          <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px 30px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginRight: '15px' }}>
            Explorar Soluciones
          </button>
        </div>
      </header>

      {/* SECCIONES PRINCIPALES */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        
        <section style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#60a5fa' }}>🤖 Soluciones IA</h2>
          <p style={{ color: '#94a3b8' }}>Automatización y optimización de procesos operativos para empresas.</p>
        </section>

        <section style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#a855f7' }}>🎓 Escuela Digital</h2>
          <p style={{ color: '#94a3b8' }}>Formación especializada para dominar las herramientas de IA actuales.</p>
        </section>

        <section style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#4ade80' }}>📰 Noticias IA</h2>
          <p style={{ color: '#94a3b8' }}>Mantente al día con las últimas tendencias y breakthroughs del sector.</p>
        </section>

      </main>

      <footer style={{ textAlign: 'center', padding: '50px', borderTop: '1px solid #1e293b', marginTop: '50px', color: '#475569' }}>
        <p>© 2026 Partners IA Solutions - Innovación sin límites</p>
      </footer>
    </div>
  );
}
