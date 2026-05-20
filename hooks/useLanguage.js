import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export const LANGUAGES = {
  es: 'ES',
  en: 'EN',
};

export const TRANSLATIONS = {
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Menu',
      order: 'Ordena',
      catering: 'Catering',
      locations: 'Ubicaciones',
      contact: 'Contacto',
    },
    common: {
      order: 'Ordenar',
      pickup: 'Ordenar Pickup',
      delivery: 'Pedir Delivery',
      viewLocations: 'Ver ubicaciones',
      emailTeam: 'Escribir al equipo',
      directEmail: 'Email directo',
      locations: 'Ubicaciones',
      allDay: 'Todos los dias',
      signature: 'Signature',
      closePromo: 'Cerrar promocion',
      openMenu: 'Abrir menu',
      closeMenu: 'Cerrar menu',
    },
    promo: {
      lead: '5 ubicaciones en San Antonio',
      text: 'Abierto diario {{hours}} · Pickup y delivery',
    },
    hero: {
      eyebrow: 'Los Originales de Monterrey',
      subtitle: 'Pollos Asados',
      copy: 'Pollo al carbon, parrilladas y antojos regios servidos con la intensidad de la brasa. Cinco ubicaciones en San Antonio, listas para pickup o delivery.',
      hoursLabel: 'Todos los dias',
      driveLabel: 'Culebra 1',
      signatureDesc: '8 piezas con arroz, cebolla asada, chile toreado, limon, tortillas y salsas roja y verde.',
    },
    menu: {
      eyebrow: 'Menu de la Casa',
      title: 'La brasa como protagonista',
      copy: 'Pollo asado al carbon, cortes a la parrilla, parrilladas para compartir y postres caseros con una carta clara y directa.',
      featured: 'Favoritos de la casa',
      dishes: 'platillos',
      official: 'Menu oficial Al Carbon',
      officialShort: 'Menu oficial',
      viewFull: 'Ver menu completo',
      categories: {
        all: 'Featured',
        chicken: 'Chicken',
        beef: 'Beef',
        parrilladas: 'Parrilladas',
        burgers: 'Burgers',
        desserts: 'Desserts',
        drinks: 'Drinks',
        extras: 'Extras',
      },
    },
    cateringCta: {
      eyebrow: 'Catering Al Carbon',
      title: 'Lleva la brasa a tu evento.',
      copy: 'Reuniones familiares, oficinas, celebraciones y eventos grandes con el sabor regio de Al Carbon, coordinado desde nuestras sucursales de San Antonio.',
      quote: 'Cotizar catering',
      ideal: 'Ideal para',
      points: ['Parrilladas para grupos', 'Pollo al carbon por volumen', 'Sides, salsas y tortillas'],
      note: 'Completa la solicitud y el equipo recibe todos los detalles del evento en el correo oficial del sitio.',
    },
    catering: {
      title: 'Catering Al Carbon | Eventos y Parrilladas en San Antonio',
      meta: 'Catering de Al Carbon Pollos Asados para eventos en San Antonio. Solicita pollo al carbon, parrilladas, fajita, sides y coordinacion para grupos.',
      heroEyebrow: 'Catering request',
      heroSubtitle: 'Al Carbon',
      heroCopy: 'Planning an event? Let us handle the food with pollo al carbon, parrilladas, fajita, sides and the brasa flavor San Antonio already knows.',
      quote: 'Solicitar cotizacion',
      statsEyebrow: 'Eventos con fuego real',
      branches: 'Sucursales',
      daily: 'Diario',
      fire: 'Brasa',
      regional: 'Regia',
      introEyebrow: 'Catering premium',
      introTitle: 'Una mesa que se siente abundante desde que llega.',
      introCopy: 'Disenamos pedidos para grupos con los platos que ya cargan la identidad de Al Carbon: pollo, fajita, parrilladas, arroz, frijoles charros, tortillas y salsas.',
      packages: [
        {
          title: 'Pollo al carbon',
          kicker: 'Firma de la casa',
          desc: 'Pollos enteros o medios pollos con arroz, tortillas, chile toreado, cebolla asada y salsas.',
          detail: 'Perfecto para grupos familiares y reuniones de oficina.',
        },
        {
          title: 'Parrilladas',
          kicker: 'Para compartir',
          desc: 'Fajita, pollo, salchicha, charro beans, ensalada, tortillas y salsas con porciones generosas.',
          detail: 'La opcion mas completa para mesas grandes.',
        },
        {
          title: 'Fajita y sides',
          kicker: 'Plan a la medida',
          desc: 'Arma el volumen del evento con fajita de res, arroz, frijoles charros, bebidas y extras.',
          detail: 'Ideal cuando necesitas control de porciones.',
        },
      ],
      processEyebrow: 'Proceso',
      processTitle: 'Del primer mensaje al ultimo taco.',
      processCopy: 'El formulario deja todo organizado para que el equipo pueda responder con contexto: fecha, volumen, sucursal, presupuesto y notas importantes.',
      steps: [
        { title: 'Cuentanos el evento', desc: 'Fecha, horario, numero de invitados, sucursal ideal y estilo de servicio.' },
        { title: 'Coordinamos el pedido', desc: 'El equipo revisa cantidades, tiempos y disponibilidad para darte una propuesta clara.' },
        { title: 'Sale caliente', desc: 'Tu orden se prepara con el mismo fuego de la casa y lista para tu celebracion.' },
      ],
      requestEyebrow: 'Solicitud',
      requestTitle: 'Cuentanos que estas planeando.',
      requestCopy: 'El pedido llega preparado al correo oficial del sitio. Para contacto directo, escribe a',
      hoursLabel: 'Horario',
      coverageLabel: 'Cobertura',
      coverage: '5 ubicaciones en San Antonio',
      everyDay: 'todos los dias',
      locationEyebrow: 'Sucursales',
      locationTitle: 'Elige el punto mas conveniente.',
      viewMap: 'Ver mapa',
      form: {
        name: 'Nombre',
        email: 'Email',
        phone: 'Telefono',
        company: 'Empresa u organizacion',
        date: 'Fecha',
        time: 'Hora',
        guests: 'Invitados',
        eventType: 'Tipo de evento',
        location: 'Sucursal preferida',
        service: 'Servicio',
        budget: 'Presupuesto estimado',
        notes: 'Detalles del evento',
        namePlaceholder: 'Tu nombre',
        companyPlaceholder: 'Opcional',
        datePlaceholder: 'Selecciona fecha',
        notesPlaceholder: 'Cuentanos el lugar, horario, comida que tienes en mente, necesidades especiales y cualquier detalle importante.',
        selectLabel: 'Selecciona',
        today: 'Hoy',
        submit: 'Enviar solicitud',
        dateError: 'Selecciona la fecha del evento.',
        emptyGuests: 'Comparte invitados para estimar volumen.',
        compact: 'Formato compacto: pollo, sides y extras clave.',
        event: 'Formato evento: parrilladas, sides y bebidas por volumen.',
        large: 'Formato grande: coordinacion especial y pickup por horario.',
        sent: 'Se abrio tu aplicacion de correo con la solicitud dirigida a {{email}}.',
        help: 'El formulario abre un email dirigido a {{email}} con todos los detalles listos para enviar.',
      },
      eventTypes: {
        family: 'Family gathering',
        office: 'Office lunch',
        birthday: 'Birthday',
        graduation: 'Graduation',
        corporate: 'Corporate event',
        wedding: 'Wedding or rehearsal',
        other: 'Other',
      },
      serviceStyles: {
        pickup: 'Pickup from location',
        largeOrder: 'Large order coordination',
        guidance: 'Need guidance',
      },
    },
    ordering: {
      eyebrow: 'Ordena Al Carbon',
      title: 'Tu pedido, sin perder el ritual de la brasa.',
      copy: 'El sitio debe sentirse tan directo como el servicio: eliges, confirmas y recibes comida caliente con el caracter de Monterrey.',
    },
    why: {
      eyebrow: 'Por Que Al Carbon',
      title: 'Una cocina de brasa con pulso de ciudad.',
      copy: 'Cada plato pone el producto al frente: pollo al carbon, cortes a la parrilla y una operacion pensada para moverse por San Antonio.',
    },
    locations: {
      eyebrow: 'Ubicaciones reales',
      title: 'San Antonio sabe donde caerle.',
      copy: 'Selecciona una sucursal en el mapa o en las cards para ubicarla y abrir la ruta exacta.',
      active: 'Sucursal activa',
      openMaps: 'Abrir en Maps',
      branch: 'Sucursal',
      hours: 'Horario',
      orderNow: 'Ordenar ahora',
      unavailable: 'Mapa no disponible',
      unavailableCopy: 'Usa los botones de Maps en cada sucursal para abrir la ubicacion exacta.',
    },
    footer: {
      ctaTitle: 'Listo para caerle a Al Carbon?',
      ctaCopy: 'Abierto diario {{hours}} en 5 ubicaciones de San Antonio.',
      description: 'Pollo al carbon, parrilladas y burgers con 5 puntos activos en San Antonio. Marca real, fuego real, servicio real.',
      navTitle: 'Navegacion',
      locationsTitle: 'Sucursales',
      contactTitle: 'Contacto y ordenes',
      locationCopy: '5 ubicaciones activas en San Antonio, incluyendo Culebra, Nacogdoches, Alamo Ranch y Marbach.',
      allLocations: 'Ver todas las ubicaciones',
      rights: 'All rights reserved.',
      made: 'Hecho para San Antonio con fuego, pollo y mucho antojo.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      order: 'Order',
      catering: 'Catering',
      locations: 'Locations',
      contact: 'Contact',
    },
    common: {
      order: 'Order',
      pickup: 'Order Pickup',
      delivery: 'Order Delivery',
      viewLocations: 'View locations',
      emailTeam: 'Email the team',
      directEmail: 'Direct email',
      locations: 'Locations',
      allDay: 'Every day',
      signature: 'Signature',
      closePromo: 'Close promotion',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    promo: {
      lead: '5 locations in San Antonio',
      text: 'Open daily {{hours}} · Pickup and delivery',
    },
    hero: {
      eyebrow: 'The Originals from Monterrey',
      subtitle: 'Grilled Chicken',
      copy: 'Charcoal-grilled chicken, parrilladas, and northern Mexican cravings served with the intensity of the fire. Five San Antonio locations ready for pickup or delivery.',
      hoursLabel: 'Every day',
      driveLabel: 'Culebra 1',
      signatureDesc: '8 pieces with rice, grilled onion, chile toreado, lime, tortillas, red salsa, and green salsa.',
    },
    menu: {
      eyebrow: 'House Menu',
      title: 'The fire leads the plate',
      copy: 'Charcoal-grilled chicken, grilled cuts, shareable parrilladas, and homemade desserts in a clear, direct menu.',
      featured: 'House favorites',
      dishes: 'dishes',
      official: 'Official Al Carbon menu',
      officialShort: 'Official menu',
      viewFull: 'View full menu',
      categories: {
        all: 'Featured',
        chicken: 'Chicken',
        beef: 'Beef',
        parrilladas: 'Parrilladas',
        burgers: 'Burgers',
        desserts: 'Desserts',
        drinks: 'Drinks',
        extras: 'Extras',
      },
    },
    cateringCta: {
      eyebrow: 'Al Carbon Catering',
      title: 'Bring the fire to your event.',
      copy: 'Family gatherings, office lunches, celebrations, and large events with the Al Carbon flavor, coordinated from our San Antonio locations.',
      quote: 'Request catering',
      ideal: 'Ideal for',
      points: ['Group parrilladas', 'Charcoal chicken by volume', 'Sides, salsas, and tortillas'],
      note: 'Complete the request and our team receives every event detail through the official site email.',
    },
    catering: {
      title: 'Al Carbon Catering | Events and Parrilladas in San Antonio',
      meta: 'Al Carbon Pollos Asados catering for events in San Antonio. Request charcoal chicken, parrilladas, fajita, sides, and group coordination.',
      heroEyebrow: 'Catering request',
      heroSubtitle: 'Al Carbon',
      heroCopy: 'Planning an event? Let us handle the food with charcoal chicken, parrilladas, fajita, sides, and the fire-grilled flavor San Antonio already knows.',
      quote: 'Request a quote',
      statsEyebrow: 'Events with real fire',
      branches: 'Locations',
      daily: 'Daily',
      fire: 'Fire',
      regional: 'Monterrey',
      introEyebrow: 'Premium catering',
      introTitle: 'A table that feels generous the moment it arrives.',
      introCopy: 'We build group orders around the plates that carry Al Carbon’s identity: chicken, fajita, parrilladas, rice, charro beans, tortillas, and salsas.',
      packages: [
        {
          title: 'Charcoal chicken',
          kicker: 'House signature',
          desc: 'Whole or half chickens with rice, tortillas, chile toreado, grilled onion, and salsas.',
          detail: 'Perfect for family gatherings and office meals.',
        },
        {
          title: 'Parrilladas',
          kicker: 'Made to share',
          desc: 'Fajita, chicken, sausage, charro beans, salad, tortillas, and salsas with generous portions.',
          detail: 'The most complete option for bigger tables.',
        },
        {
          title: 'Fajita and sides',
          kicker: 'Built to fit',
          desc: 'Plan your event volume with beef fajita, rice, charro beans, drinks, and extras.',
          detail: 'Ideal when you need portion control.',
        },
      ],
      processEyebrow: 'Process',
      processTitle: 'From the first message to the last taco.',
      processCopy: 'The form organizes everything our team needs to respond with context: date, volume, preferred location, budget, and important notes.',
      steps: [
        { title: 'Tell us about the event', desc: 'Date, time, guest count, preferred location, and service style.' },
        { title: 'We coordinate the order', desc: 'The team reviews quantities, timing, and availability to provide a clear plan.' },
        { title: 'It leaves hot', desc: 'Your order is prepared with the same house fire and ready for your celebration.' },
      ],
      requestEyebrow: 'Request',
      requestTitle: 'Tell us what you are planning.',
      requestCopy: 'Your request is prepared for the official site email. For direct contact, write to',
      hoursLabel: 'Hours',
      coverageLabel: 'Coverage',
      coverage: '5 locations in San Antonio',
      everyDay: 'every day',
      locationEyebrow: 'Locations',
      locationTitle: 'Choose the most convenient location.',
      viewMap: 'View map',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company or organization',
        date: 'Date',
        time: 'Time',
        guests: 'Guests',
        eventType: 'Event type',
        location: 'Preferred location',
        service: 'Service',
        budget: 'Estimated budget',
        notes: 'Event details',
        namePlaceholder: 'Your name',
        companyPlaceholder: 'Optional',
        datePlaceholder: 'Select date',
        notesPlaceholder: 'Tell us the venue, timing, food you have in mind, special needs, and any important details.',
        selectLabel: 'Select',
        today: 'Today',
        submit: 'Send request',
        dateError: 'Select the event date.',
        emptyGuests: 'Add guest count to estimate volume.',
        compact: 'Compact format: chicken, sides, and key extras.',
        event: 'Event format: parrilladas, sides, and drinks by volume.',
        large: 'Large format: special coordination and scheduled pickup.',
        sent: 'Your email app opened with the request addressed to {{email}}.',
        help: 'The form opens an email addressed to {{email}} with every detail ready to send.',
      },
      eventTypes: {
        family: 'Family gathering',
        office: 'Office lunch',
        birthday: 'Birthday',
        graduation: 'Graduation',
        corporate: 'Corporate event',
        wedding: 'Wedding or rehearsal',
        other: 'Other',
      },
      serviceStyles: {
        pickup: 'Pickup from location',
        largeOrder: 'Large order coordination',
        guidance: 'Need guidance',
      },
    },
    ordering: {
      eyebrow: 'Order Al Carbon',
      title: 'Your order, without losing the ritual of the fire.',
      copy: 'The experience should feel as direct as the service: choose, confirm, and receive hot food with the character of Monterrey.',
    },
    why: {
      eyebrow: 'Why Al Carbon',
      title: 'A fire-grilled kitchen with city rhythm.',
      copy: 'Every plate puts the product first: charcoal chicken, grilled cuts, and an operation built to move across San Antonio.',
    },
    locations: {
      eyebrow: 'Real locations',
      title: 'San Antonio knows where to pull up.',
      copy: 'Select a location on the map or cards to find it and open the exact route.',
      active: 'Active location',
      openMaps: 'Open in Maps',
      branch: 'Location',
      hours: 'Hours',
      orderNow: 'Order now',
      unavailable: 'Map unavailable',
      unavailableCopy: 'Use the Maps buttons on each location to open the exact address.',
    },
    footer: {
      ctaTitle: 'Ready for Al Carbon?',
      ctaCopy: 'Open daily {{hours}} across 5 San Antonio locations.',
      description: 'Charcoal chicken, parrilladas, and burgers with 5 active locations in San Antonio. Real brand, real fire, real service.',
      navTitle: 'Navigation',
      locationsTitle: 'Locations',
      contactTitle: 'Contact and orders',
      locationCopy: '5 active locations in San Antonio, including Culebra, Nacogdoches, Alamo Ranch, and Marbach.',
      allLocations: 'View all locations',
      rights: 'All rights reserved.',
      made: 'Made for San Antonio with fire, chicken, and serious cravings.',
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'es';
    return window.localStorage.getItem('al-carbon-language') || 'es';
  });

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('al-carbon-language', nextLanguage);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'es';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: TRANSLATIONS[language],
  }), [language]);

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}

export function interpolate(template, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template,
  );
}
