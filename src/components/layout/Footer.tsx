import Link from 'next/link';

const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
  { name: 'Instagram', href: '#', icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' },
  { name: 'WhatsApp', href: '#', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.222-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.484-1.781-1.66-2.08-.173-.309-.018-.476.13-.625.136-.135.298-.355.446-.532.149-.174.198-.298.298-.497.099-.198.05-.373-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.012-.371-.011-.57-.011a1.1 1.1 0 00-.794.37c-.272.298-1.04 1.021-1.04 2.489 0 1.469 1.064 2.888 1.213 3.087.149.198 2.096 3.2 5.078 4.487.709.306 1.262.489 1.694.625.712.227 1.36.196 1.871.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.345m-5.446 7.443h-.016a9.77 9.77 0 01-4.37-1.021l-.31-.147-3.206.842.854-3.07-.202-.32a9.7 9.7 0 01-1.5-5.18c.006-5.45 4.477-9.89 9.998-9.89 2.67 0 5.18 1.04 7.07 2.93 1.888 1.88 2.93 4.39 2.93 7.06-.004 5.52-4.444 9.99-9.964 9.99M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.36.101 11.943c0 2.096.55 4.14 1.595 5.945L0 24l6.335-1.652a11.98 11.98 0 005.702 1.448h.006c6.585 0 11.946-5.365 11.949-11.947 0-3.18-1.24-6.166-3.495-8.411' },
];

const footerLinks = [
  {
    title: 'Servicios',
    links: [
      { name: 'Baños portátiles', href: '#' },
      { name: 'Eventos especiales', href: '#' },
      { name: 'Construcción', href: '#' },
      { name: 'Mantenimiento', href: '#' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { name: 'Nosotros', href: '#' },
      { name: 'Sustentabilidad', href: '#' },
      { name: 'Trabaja con nosotros', href: '#' },
      { name: 'Contacto', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Términos y condiciones', href: '#' },
      { name: 'Política de privacidad', href: '#' },
      { name: 'Aviso legal', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-[var(--primary)]">Mobilet</span>
            </div>
            <p className="text-gray-600 text-sm">
              Soluciones en sanitarios portátiles para eventos y construcción. Calidad y servicio en cada baño.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-[var(--primary)]">
                  <span className="sr-only">{item.name}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Enlaces del footer */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-base text-gray-600 hover:text-[var(--primary)]"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Mobilet. Todos los derechos reservados. <span className="text-xs">Powered by floxia.io</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
