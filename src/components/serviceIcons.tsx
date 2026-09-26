import type { ComponentType, SVGProps } from "react";

export const SERVICE_ICON_NAMES = [
  "calendar",
  "sparkles",
  "box",
  "house",
  "spray",
  "bucket",
  "broom",
  "bathtub",
  "bed",
  "window",
  "truck",
  "key",
  "heart",
  "pin",
  "star",
  "shield",
  "leaf",
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

export type ServiceIconProps = SVGProps<SVGSVGElement> & { size?: number };

type IconComponent = ComponentType<ServiceIconProps>;

function baseProps(
  name: ServiceIconName,
  { size = 24, ...rest }: ServiceIconProps,
) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    "data-icon": name,
    ...rest,
  };
}

function CalendarIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("calendar", props)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

function SparklesIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("sparkles", props)}>
      <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.8L12 15.6l-1.8-4.5L6 9.3l4.2-1.8L12 3z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
      <path d="M5 15l.7 1.6L7.3 17l-1.6.7L5 19.3l-.7-1.6L2.7 17l1.6-.7L5 15z" />
    </svg>
  );
}

function BoxIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("box", props)}>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5" />
      <line x1="12" y1="13" x2="12" y2="22" />
    </svg>
  );
}

function HouseIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("house", props)}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v11h14V10" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

function SprayIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("spray", props)}>
      <path d="M10 3h4v3l3 1v3H7V7l3-1z" />
      <rect x="7" y="10" width="10" height="11" rx="1" />
      <line x1="7" y1="15" x2="17" y2="15" />
      <circle cx="20" cy="4" r="0.5" />
      <circle cx="22" cy="6" r="0.5" />
      <circle cx="20" cy="8" r="0.5" />
    </svg>
  );
}

function BucketIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("bucket", props)}>
      <path d="M4 8h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 8z" />
      <path d="M7 8V6a5 5 0 0 1 10 0v2" />
    </svg>
  );
}

function BroomIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("broom", props)}>
      <line x1="20" y1="4" x2="11" y2="13" />
      <path d="M4 20l7-7 4 4-7 7z" />
      <line x1="7" y1="16" x2="11" y2="20" />
      <line x1="9" y1="14" x2="13" y2="18" />
    </svg>
  );
}

function BathtubIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("bathtub", props)}>
      <path d="M3 11h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4z" />
      <path d="M6 11V6a2 2 0 0 1 4 0" />
      <line x1="6" y1="18" x2="6" y2="21" />
      <line x1="18" y1="18" x2="18" y2="21" />
    </svg>
  );
}

function BedIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("bed", props)}>
      <path d="M2 20v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v5" />
      <line x1="2" y1="17" x2="22" y2="17" />
      <path d="M6 12v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

function WindowIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("window", props)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function TruckIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("truck", props)}>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function KeyIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("key", props)}>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9" />
      <line x1="17" y1="12" x2="17" y2="15" />
      <line x1="20" y1="12" x2="20" y2="14" />
    </svg>
  );
}

function HeartIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("heart", props)}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function PinIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("pin", props)}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("star", props)}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ShieldIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("shield", props)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LeafIcon(props: ServiceIconProps) {
  return (
    <svg {...baseProps("leaf", props)}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

const ICONS: Record<ServiceIconName, IconComponent> = {
  heart: HeartIcon,
  pin: PinIcon,
  star: StarIcon,
  shield: ShieldIcon,
  leaf: LeafIcon,
  calendar: CalendarIcon,
  sparkles: SparklesIcon,
  box: BoxIcon,
  house: HouseIcon,
  spray: SprayIcon,
  bucket: BucketIcon,
  broom: BroomIcon,
  bathtub: BathtubIcon,
  bed: BedIcon,
  window: WindowIcon,
  truck: TruckIcon,
  key: KeyIcon,
};

const CYCLE_FALLBACK: ServiceIconName[] = ["calendar", "sparkles", "box"];

export function isServiceIconName(value: unknown): value is ServiceIconName {
  return (
    typeof value === "string" &&
    (SERVICE_ICON_NAMES as readonly string[]).includes(value)
  );
}

export function getServiceIcon(
  name: string | undefined | null,
  index: number,
): IconComponent {
  if (isServiceIconName(name)) return ICONS[name];
  const fallback = CYCLE_FALLBACK[index % CYCLE_FALLBACK.length];
  return ICONS[fallback];
}

export function getServiceIconName(
  name: string | undefined | null,
  index: number,
): ServiceIconName {
  if (isServiceIconName(name)) return name;
  return CYCLE_FALLBACK[index % CYCLE_FALLBACK.length];
}
