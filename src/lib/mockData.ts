import type { Facility, Order, ForecastAlert, ComponentType } from './types';

const BASE_LOCATION = {
  name: 'North Dumdum',
  lat: 22.6203,
  lng: 88.3971,
};

export const DEFAULT_LOCATION = BASE_LOCATION;

function stock(prbc: number, plt: number, ffp: number, cryo: number) {
  return [
    { type: 'PRBC' as ComponentType, available: prbc, demand: Math.round(prbc * 0.85) },
    { type: 'PLATELETS' as ComponentType, available: plt, demand: Math.round(plt * 0.95) },
    { type: 'FFP' as ComponentType, available: ffp, demand: Math.round(ffp * 0.7) },
    { type: 'CRYO' as ComponentType, available: cryo, demand: Math.round(cryo * 0.6) },
  ];
}

export const facilities: Facility[] = [
  {
    id: 'h1',
    name: 'North Dumdum District Hospital',
    type: 'hospital',
    address: '49, Jessore Road, North Dumdum',
    area: 'North Dumdum',
    distanceKm: 1.2,
    phone: '+91 33 2555 1234',
    lat: 22.6238,
    lng: 88.4012,
    components: stock(42, 18, 30, 8),
  },
  {
    id: 'h2',
    name: 'Bidhan Nagar Sub-Divisional Hospital',
    type: 'hospital',
    address: 'LB Block, Salt Lake, Bidhan Nagar',
    area: 'Salt Lake',
    distanceKm: 6.4,
    phone: '+91 33 2358 9012',
    lat: 22.5868,
    lng: 88.4219,
    components: stock(55, 22, 38, 12),
  },
  {
    id: 'h3',
    name: 'R.G. Kar Medical College & Hospital',
    type: 'hospital',
    address: '1, Dr. U. N. Banerjee Road',
    area: 'Shyambazar',
    distanceKm: 8.7,
    phone: '+91 33 2555 7700',
    lat: 22.6106,
    lng: 88.3712,
    components: stock(80, 35, 60, 20),
  },
  {
    id: 'b1',
    name: 'Central Blood Bank, Maniktala',
    type: 'bloodbank',
    address: '118, Maniktala Main Road',
    area: 'Maniktala',
    distanceKm: 7.1,
    phone: '+91 33 2323 4444',
    lat: 22.5827,
    lng: 88.3812,
    components: stock(120, 65, 95, 30),
  },
  {
    id: 'b2',
    name: 'LifeCare Blood Centre, Dum Dum',
    type: 'bloodbank',
    address: '12, Rabin Pal Road, Dum Dum',
    area: 'Dum Dum',
    distanceKm: 2.8,
    phone: '+91 33 2548 7788',
    lat: 22.6345,
    lng: 88.4118,
    components: stock(70, 40, 50, 15),
  },
  {
    id: 'b3',
    name: 'Red Cross Regional Blood Bank',
    type: 'bloodbank',
    address: '5, Mango Lane, B.B.D. Bagh',
    area: 'BBD Bag',
    distanceKm: 11.3,
    phone: '+91 33 2231 6655',
    lat: 22.5764,
    lng: 88.3524,
    components: stock(90, 50, 70, 22),
  },
  {
    id: 'b4',
    name: 'NRS Medical College Blood Bank',
    type: 'bloodbank',
    address: '138, Raja Bazar Road',
    area: 'Raja Bazar',
    distanceKm: 9.5,
    phone: '+91 33 2320 5566',
    lat: 22.5989,
    lng: 88.3923,
    components: stock(105, 58, 80, 18),
  },
];

export const hospitals = facilities.filter((f) => f.type === 'hospital');
export const bloodBanks = facilities.filter((f) => f.type === 'bloodbank');

const now = new Date();
const iso = (offsetMin: number) => new Date(now.getTime() - offsetMin * 60000).toISOString();

export const orders: Order[] = [
  {
    id: 'o1',
    orderCode: 'RS-2408-0042',
    requesterId: 'h1',
    requesterName: 'North Dumdum District Hospital',
    supplierId: 'b2',
    supplierName: 'LifeCare Blood Centre, Dum Dum',
    patientName: 'Patient #ND-1184',
    patientRef: 'IPD/NDH/2024/1184',
    priority: 'emergency',
    status: 'queued',
    lines: [
      { component: 'PLATELETS', bloodGroup: 'B+', units: 3 },
      { component: 'FFP', bloodGroup: 'B+', units: 2 },
    ],
    createdAt: iso(4),
    updatedAt: iso(4),
    history: [{ status: 'queued', at: iso(4) }],
  },
  {
    id: 'o2',
    orderCode: 'RS-2408-0041',
    requesterId: 'h3',
    requesterName: 'R.G. Kar Medical College & Hospital',
    supplierId: 'b1',
    supplierName: 'Central Blood Bank, Maniktala',
    patientName: 'Patient #RGK-9032',
    patientRef: 'IPD/RGK/2024/9032',
    priority: 'normal',
    status: 'delivering',
    lines: [{ component: 'PRBC', bloodGroup: 'O+', units: 4 }],
    createdAt: iso(75),
    updatedAt: iso(20),
    history: [
      { status: 'queued', at: iso(75) },
      { status: 'delivering', at: iso(20) },
    ],
  },
  {
    id: 'o3',
    orderCode: 'RS-2408-0040',
    requesterId: 'h2',
    requesterName: 'Bidhan Nagar Sub-Divisional Hospital',
    supplierId: 'b3',
    supplierName: 'Red Cross Regional Blood Bank',
    patientName: 'Patient #BN-5561',
    patientRef: 'IPD/BNSH/2024/5561',
    priority: 'emergency',
    status: 'delivering',
    lines: [
      { component: 'PRBC', bloodGroup: 'A-', units: 2 },
      { component: 'CRYO', bloodGroup: 'A-', units: 4 },
    ],
    createdAt: iso(120),
    updatedAt: iso(12),
    history: [
      { status: 'queued', at: iso(120) },
      { status: 'delivering', at: iso(12) },
    ],
  },
  {
    id: 'o4',
    orderCode: 'RS-2408-0039',
    requesterId: 'h1',
    requesterName: 'North Dumdum District Hospital',
    supplierId: 'b2',
    supplierName: 'LifeCare Blood Centre, Dum Dum',
    patientName: 'Patient #ND-1170',
    patientRef: 'IPD/NDH/2024/1170',
    priority: 'normal',
    status: 'delivered',
    lines: [{ component: 'PRBC', bloodGroup: 'B+', units: 2 }],
    createdAt: iso(600),
    updatedAt: iso(300),
    history: [
      { status: 'queued', at: iso(600) },
      { status: 'delivering', at: iso(420) },
      { status: 'delivered', at: iso(300) },
    ],
  },
  {
    id: 'o5',
    orderCode: 'RS-2408-0038',
    requesterId: 'h2',
    requesterName: 'Bidhan Nagar Sub-Divisional Hospital',
    supplierId: 'b1',
    supplierName: 'Central Blood Bank, Maniktala',
    patientName: 'Patient #BN-5548',
    patientRef: 'IPD/BNSH/2024/5548',
    priority: 'normal',
    status: 'delivered',
    lines: [{ component: 'PLATELETS', bloodGroup: 'O+', units: 2 }],
    createdAt: iso(1440),
    updatedAt: iso(1100),
    history: [
      { status: 'queued', at: iso(1440) },
      { status: 'delivering', at: iso(1200) },
      { status: 'delivered', at: iso(1100) },
    ],
  },
];

export const forecastAlerts: ForecastAlert[] = [
  {
    id: 'f1',
    component: 'PLATELETS',
    tone: 'critical',
    title: 'Increase Platelet stock by 20%',
    detail:
      'Seasonal dengue outbreak trend detected in Kolkata metro. Historical 3-year data shows platelet demand spikes 22-28% during Aug–Oct. Current buffer is below safety threshold.',
    recommendPct: 20,
    season: 'Monsoon / Dengue season (Aug–Oct)',
  },
  {
    id: 'f2',
    component: 'PRBC',
    tone: 'warning',
    title: 'Raise Packed RBC buffer by 12%',
    detail:
      'Festival-period road traffic incidents historically rise 15% in October. Recommend pre-positioning additional O+ and O- universal units.',
    recommendPct: 12,
    season: 'Festival season (Oct)',
  },
  {
    id: 'f3',
    component: 'FFP',
    tone: 'info',
    title: 'Maintain current FFP levels',
    detail:
      'Burn-case admissions remain stable through Q3. No significant deviation forecast. Keep current stock rotation.',
    recommendPct: 0,
    season: 'Q3 baseline',
  },
  {
    id: 'f4',
    component: 'CRYO',
    tone: 'ok',
    title: 'Cryoprecipitate surplus — reduce orders',
    detail:
      'Demand has trended 8% below forecast over the last 6 weeks. Safe to reduce next procurement cycle by 10%.',
    recommendPct: -10,
    season: 'Current cycle',
  },
];

// 12-week demand history (mock) per component for charts
export const demandHistory: {
  week: string;
  PRBC: number;
  PLATELETS: number;
  FFP: number;
  CRYO: number;
}[] = Array.from({ length: 12 }, (_, i) => {
  const w = i + 1;
  return {
    week: `W${w}`,
    PRBC: 60 + Math.round(Math.sin(i / 2) * 12) + (i > 8 ? 8 : 0),
    PLATELETS: 28 + Math.round(Math.sin(i / 2.5) * 8) + (i > 7 ? 14 : 0),
    FFP: 40 + Math.round(Math.cos(i / 3) * 6),
    CRYO: 12 + Math.round(Math.sin(i / 4) * 3),
  };
});
