type CarIllustrationProps = {
  color: string;
  label?: string;
  className?: string;
};

/**
 * Ilustrasi mobil tampak samping (SVG orisinal, gaya flat).
 * Dipakai untuk menghindari foto stok yang tidak jelas lisensinya.
 */
export function CarIllustration({
  color,
  label,
  className,
}: CarIllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 150"
      className={className}
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* bayangan di bawah mobil */}
      <ellipse cx="160" cy="133" rx="132" ry="8" fill="#0f172a" opacity="0.08" />

      {/* roda */}
      <circle cx="84" cy="104" r="21" fill="#1e293b" />
      <circle cx="84" cy="104" r="10" fill="#cbd5e1" />
      <circle cx="240" cy="104" r="21" fill="#1e293b" />
      <circle cx="240" cy="104" r="10" fill="#cbd5e1" />

      {/* bodi */}
      <path
        d="M20 98
           C20 90 26 86 34 85
           L50 79
           L86 62
           L88 60
           L150 60
           L152 62
           L190 80
           L258 84
           C274 85 286 89 291 96
           L293 106
           Q293 110 287 110
           L27 110
           Q20 110 20 104
           Z"
        fill={color}
      />

      {/* strip aksen bawah */}
      <path
        d="M20 104 L20 100 C26 96 34 95 44 94 L258 90 C276 91 288 95 293 102 L293 106 Q293 110 287 110 L27 110 Q20 110 20 104 Z"
        fill="#0f172a"
        opacity="0.12"
      />

      {/* kaca */}
      <path
        d="M92 65 L146 62 L182 80 L94 79 Z"
        fill="#eef2f7"
        opacity="0.95"
      />
      {/* pilar B */}
      <path d="M118 63 L123 78" stroke={color} strokeWidth="5" />

      {/* garis pintu */}
      <path
        d="M100 92 L250 92"
        stroke="#0f172a"
        strokeOpacity="0.18"
        strokeWidth="2"
      />
      {/* gagang pintu */}
      <path
        d="M118 84 L132 84"
        stroke="#0f172a"
        strokeOpacity="0.3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M186 84 L200 84"
        stroke="#0f172a"
        strokeOpacity="0.3"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* lampu belakang */}
      <rect x="24" y="86" width="8" height="7" rx="1.5" fill="#f87171" />
      {/* lampu depan */}
      <path
        d="M283 92 L292 94 L292 99 L283 97 Z"
        fill="#fde68a"
      />
    </svg>
  );
}
