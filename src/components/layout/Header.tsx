import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-[var(--primary)]">Mobilet</span>
          </Link>
          
          {/* Menú de navegación */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#servicios" className="text-gray-600 hover:text-[var(--primary)] transition-colors">
              Servicios
            </Link>
            <Link href="#cotizar" className="text-gray-600 hover:text-[var(--primary)] transition-colors">
              Cotizar
            </Link>
            <Link href="#contacto" className="text-gray-600 hover:text-[var(--primary)] transition-colors">
              Contacto
            </Link>
          </nav>
          
          {/* Menú móvil */}
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
