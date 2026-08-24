export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType = 'PRBC' | 'PLATELETS' | 'FFP' | 'CRYO';

export type OrderPriority = 'normal' | 'emergency';
export type OrderStatus = 'queued' | 'delivering' | 'delivered';

export interface ComponentStock {
  type: ComponentType;
  available: number; // units in stock
  demand: number; // forecasted demand units
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'bloodbank';
  address: string;
  area: string;
  distanceKm: number;
  phone: string;
  lat: number;
  lng: number;
  components: ComponentStock[];
}

export interface OrderLine {
  component: ComponentType;
  bloodGroup: BloodGroup;
  units: number;
}

export interface Order {
  id: string;
  orderCode: string;
  requesterId: string; // hospital id
  requesterName: string;
  supplierId: string; // blood bank id
  supplierName: string;
  patientName: string;
  patientRef: string;
  priority: OrderPriority;
  status: OrderStatus;
  lines: OrderLine[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  history: { status: OrderStatus; at: string }[];
}

export interface ForecastAlert {
  id: string;
  component: ComponentType;
  tone: 'critical' | 'warning' | 'info' | 'ok';
  title: string;
  detail: string;
  recommendPct: number;
  season: string;
}

export const COMPONENT_META: Record<
  ComponentType,
  { label: string; short: string; desc: string; color: string; bg: string }
> = {
  PRBC: {
    label: 'Packed RBC',
    short: 'PRBC',
    desc: 'Red blood cells concentrated for anemia & trauma',
    color: 'text-primary-700',
    bg: 'bg-primary-50 border-primary-100',
  },
  PLATELETS: {
    label: 'Platelets',
    short: 'PLT',
    desc: 'For clotting disorders, dengue, chemo support',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-100',
  },
  FFP: {
    label: 'Fresh Frozen Plasma',
    short: 'FFP',
    desc: 'Plasma for burns, liver disease, coagulation',
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-100',
  },
  CRYO: {
    label: 'Cryoprecipitate',
    short: 'CRYO',
    desc: 'Fibrinogen & factor VIII for bleeding disorders',
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-100',
  },
};

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const STATUS_META: Record<OrderStatus, { label: string; step: number }> = {
  queued: { label: 'Queued', step: 1 },
  delivering: { label: 'Delivering', step: 2 },
  delivered: { label: 'Delivered', step: 3 },
};
