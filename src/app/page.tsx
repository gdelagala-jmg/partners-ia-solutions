'use client'
import React from 'react';
// Importamos los iconos necesarios
import { Zap, Bot, GraduationCap, Newspaper, Users, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Navegación */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 rounded-lg font-bold">P</div>
          <span className="font-bold text-xl">PartnersIA</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600">
          <a href="#">Soluciones</a>
          <a href="#">Escuela</a>
          <a href="#">Noticias IA</a>
          <a href="#">Podcast</a>
          <a href="#">Contacto</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-600">Acceso</button>
          <button className="bg-black text-white px-6 py-2 rounded-full">Contactar</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="text-center py-20 px-4">
        <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1 mb-8">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          <span className="text-sm font-medium">Liderando la Revolución de la IA</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Transformamos el Futuro<br />
          <span className="text-blue-600">Con Inteligencia Artificial</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
          Diseñamos, construimos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.
        </p>
      </main>
    </div>
  );
}
