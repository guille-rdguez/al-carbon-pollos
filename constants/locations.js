export const EVERYDAY_HOURS = '11:00 AM - 9:00 PM';
export const CONTACT_EMAIL = 'admin@alcarbonsatx.restaurant';

export const BRAND_FACTS = [
  { value: '5', label: 'ubicaciones en San Antonio' },
  { value: '11AM - 9PM', label: 'abierto todos los dias' },
  { value: 'Drive Thru', label: 'activo en Culebra 1' },
  { value: 'Uber Eats + DoorDash', label: 'delivery en 4 sucursales' },
];

export const BRAND_PILLS = [
  'Los Originales de Monterrey',
  'Whole Chicken',
  'Parrillada Familiar',
  'Monterrey Burger',
  'Papa Nortena',
];

export const SIGNATURE_DISHES = [
  {
    name: 'Whole Chicken',
    desc: 'Pollo entero con arroz, grilled onion, chile toreado, lime, tortillas y salsas roja y verde.',
  },
  {
    name: 'Parrillada Familiar',
    desc: 'Fajita, pollo entero, salchicha especial, arroz, charro beans, ensalada y tortillas para compartir.',
  },
  {
    name: 'Monterrey Burger',
    desc: 'Angus, jamon, Monterrey Jack, chile toreado, chipotle, grilled onion y guacamole.',
  },
  {
    name: 'Papa Nortena',
    desc: 'Loaded baked potato con grilled beef, cheddar, bacon, crackers y jalapenos.',
  },
];

export const LOCATIONS = [
  {
    name: 'Alamo Ranch',
    cloverSlug: 'alamo-ranch',
    address: '10555 Culebra Rd, San Antonio, TX',
    compactAddress: '10555 Culebra Rd, San Antonio, TX',
    phone: '(210) 314-1127',
    phoneHref: 'tel:2103141127',
    lat: 29.4988,
    lng: -98.7081,
    tagKeys: ['uberEats', 'doorDash', 'pickup'],
    noteKey: 'alamoRanch',
    delivery: {
      doorDash: 'https://www.doordash.com/store/al-carbon-pollos-asados-san-antonio-24538471/',
      uberEats: 'https://www.ubereats.com/store/al-carbon-pollos-asados-4/SOh5XLFnVxGJ9q8KFF4HDQ',
    },
    orderUrl: '/menu?location=alamo-ranch',
    cloverUrl: 'https://www.clover.com/online-ordering/al-carbon-4-san-antonio',
    mapsUrl: 'https://www.google.com/maps/place/Al+Carbon+Pollos+Asados+-+Alamo+Ranch/data=!4m2!3m1!1s0x0:0x77b745bc31fee8b5?sa=X&ved=1t:2428&ictx=111',
    accent: 'from-primary/20 via-white/5 to-transparent',
  },
  {
    name: 'Culebra 1',
    cloverSlug: 'culebra-1',
    address: '403 Culebra Rd, San Antonio, TX',
    compactAddress: '403 Culebra Rd, San Antonio, TX',
    phone: '(210) 467-5155',
    phoneHref: 'tel:2104675155',
    lat: 29.4499,
    lng: -98.5338,
    tagKeys: ['driveThru', 'uberEats', 'doorDash'],
    noteKey: 'culebra1',
    delivery: {
      doorDash: 'https://www.doordash.com/store/al-carbon-pollos-asados-san-antonio-27805644/',
      uberEats: 'https://www.ubereats.com/store/al-carbon-pollos-asados-1/yXw0EJQxToqI9N6qfFPe-g',
    },
    orderUrl: '/menu?location=culebra-1',
    cloverUrl: 'https://www.clover.com/online-ordering/al-carbon-1-san-antonio',
    mapsUrl: 'https://www.google.com/maps?vet=10CAAQoqAOahcKEwjgrNKR6MaUAxUAAAAAHQAAAAAQCg..i&rlz=1CAFOSO_enMX1143&pvq=Cg0vZy8xMXI5dzNoYjh4IioKJEFsIENhcmJvbiBQb2xsb3MgQXNhZG9zIC0gQ3VsZWJyYSAjMRACGAM&lqi=CiRBbCBDYXJib24gUG9sbG9zIEFzYWRvcyAtIEN1bGVicmEgIzEiA4gBAUic0t6xp7eAgAhaTBAAEAEQAhADEAQQBRgAGAEYAhgDGAQYBSIiYWwgY2FyYm9uIHBvbGxvcyBhc2Fkb3MgY3VsZWJyYSAjMSoOCAIQABABEAIQAxAEEAWSARJtZXhpY2FuX3Jlc3RhdXJhbnSaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMjFTYlZsNlNrbFVibXhEWWtST2NrMUhVbk5pTUVaWVZqRTVjbFZ1WXhBQvoBBAgAEDo&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&ftid=0x865c5fe1c3310079:0xaa9e9a81e1ec8040',
    accent: 'from-primary/20 via-white/5 to-transparent',
  },
  {
    name: 'Culebra 2',
    cloverSlug: 'culebra-2',
    address: '547 Culebra Rd, San Antonio, TX',
    compactAddress: '547 Culebra Rd, San Antonio, TX',
    phone: '(210) 737-7400',
    phoneHref: 'tel:2107377400',
    lat: 29.4502,
    lng: -98.5365,
    tagKeys: ['callIn', 'pickup'],
    noteKey: 'culebra2',
    // 547 has its own Grubhub. DoorDash/Uber Eats are shared with Culebra 1
    // (403) — the two storefronts are right next to each other, so the same
    // listings cover both addresses.
    delivery: {
      doorDash: 'https://www.doordash.com/store/al-carbon-pollos-asados-san-antonio-27805644/',
      uberEats: 'https://www.ubereats.com/store/al-carbon-pollos-asados-1/yXw0EJQxToqI9N6qfFPe-g',
      grubhub: 'https://www.grubhub.com/restaurant/al-carbon-pollos-asados-547-culebra-rd-san-antonio/12671432',
    },
    orderUrl: '/menu?location=culebra-2',
    cloverUrl: 'https://www.clover.com/online-ordering/al-carbon-2-san-antonio',
    mapsUrl: 'https://www.google.com/maps?vet=10CAAQoqAOahcKEwjgrNKR6MaUAxUAAAAAHQAAAAAQFA..i&rlz=1CAFOSO_enMX1143&pvq=Cg0vZy8xMWY2MTIxaDRtIioKJEFsIENhcmJvbiBQb2xsb3MgQXNhZG9zIC0gQ3VsZWJyYSAjMRACGAM&lqi=CiRBbCBDYXJib24gUG9sbG9zIEFzYWRvcyAtIEN1bGVicmEgIzEiA4gBAUiT-YKRmK2AgAhaShAAEAEQAhADEAQQBRgAGAEYAhgDGAQiImFsIGNhcmJvbiBwb2xsb3MgYXNhZG9zIGN1bGVicmEgIzEqDggCEAAQARACEAMQBBAFkgESbWV4aWNhbl9yZXN0YXVyYW50mgFEQ2k5RFFVbFJRVU52WkVOb2RIbGpSamx2VDI1R1UyUnRaRzFXYWxwVFl6QlJkRXhYVmtOaFZYQXdZbTFhYmxORlJSQUL6AQQIABAv&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&ftid=0x865c5f01dce2f92d:0x14e6f9e98451faac',
    accent: 'from-white/10 via-primary/10 to-transparent',
  },
  {
    name: 'Nacogdoches',
    cloverSlug: 'nacogdoches',
    address: '13835 Nacogdoches Rd, San Antonio, TX',
    compactAddress: '13835 Nacogdoches Rd, San Antonio, TX',
    phone: '(210) 686-9027',
    phoneHref: 'tel:2106869027',
    lat: 29.5411,
    lng: -98.4072,
    tagKeys: ['uberEats', 'doorDash', 'pickup'],
    noteKey: 'nacogdoches',
    delivery: {
      doorDash: 'https://www.doordash.com/store/al-carbon-pollos-asados-san-antonio-1532661/',
      uberEats: 'https://www.ubereats.com/store/al-carbon-pollos-asados-3/iU1p7JIAR--X0kl4TyPRHQ',
      grubhub: 'https://www.grubhub.com/restaurant/al-carbon-pollos-asados-nacogdoches-13835-nacogdoches-rd-san-antonio/13229720',
    },
    orderUrl: '/menu?location=nacogdoches',
    cloverUrl: 'https://www.clover.com/online-ordering/al-carbon-3-san-antonio',
    mapsUrl: 'https://www.google.com/maps?vet=10CAAQoqAOahcKEwjA1_Pi58aUAxUAAAAAHQAAAAAQBg..i&rlz=1CAFOSO_enMX1143&pvq=Cg0vZy8xMWZteWJfNTJ6Ih0KF2FsIGNhcmJvbiBwb2xsb3MgYXNhZG9zEAIYAw&lqi=CiNhbCBjYXJib24gcG9sbG9zIGFzYWRvcyBzYW4gYW50b25pbyIDiAEBSN6ovtXPrYCACFo5EAAQARACEAMYABgBGAIYAxgEGAUiI2FsIGNhcmJvbiBwb2xsb3MgYXNhZG9zIHNhbiBhbnRvbmlvkgESbWV4aWNhbl9yZXN0YXVyYW50&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&ftid=0x865c8d0f1b399289:0xb8eee2b467927f80',
    accent: 'from-primary/20 via-white/5 to-transparent',
  },
  {
    name: 'Marbach',
    cloverSlug: 'marbach',
    address: '7310 Marbach Rd, San Antonio, TX',
    compactAddress: '7310 Marbach Rd, San Antonio, TX',
    phone: '(210) 257-0480',
    phoneHref: 'tel:2102570480',
    lat: 29.4113,
    lng: -98.6344,
    tagKeys: ['uberEats', 'doorDash', 'pickup'],
    noteKey: 'marbach',
    // Newest branch — only DoorDash is live so far (not yet on Uber Eats/Grubhub).
    delivery: {
      doorDash: 'https://www.doordash.com/store/al-carbon-pollos-asados-san-antonio-37955917/',
    },
    orderUrl: '/menu?location=marbach',
    cloverUrl: 'https://www.clover.com/online-ordering/al-carbon-5-san-antonio',
    mapsUrl: 'https://www.google.com/maps?vet=10CAAQoqAOahcKEwjYpbTP6MaUAxUAAAAAHQAAAAAQEQ..i&rlz=1CAFOSO_enMX1143&sca_esv=9ce71a0c339af5c4&udm=1&pvq=Cg0vZy8xMW1rOWdxMGYxIh0KF2FsIGNhcmJvbiBwb2xsb3MgYXNhZG9zEAIYAw&lqi=CiNhbCBjYXJib24gcG9sbG9zIGFzYWRvcyBzYW4gYW50b25pbyIDiAEBSKGDrJfFs4CACFo5EAAQARACEAMYABgBGAIYAxgEGAUiI2FsIGNhcmJvbiBwb2xsb3MgYXNhZG9zIHNhbiBhbnRvbmlvkgEKcmVzdGF1cmFudA&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&ftid=0x865c5c9e40a0aa9f:0x5559a54550dfb8f4',
    accent: 'from-white/10 via-primary/10 to-transparent',
  },
];
