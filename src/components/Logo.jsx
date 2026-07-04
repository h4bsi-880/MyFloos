export default function Logo({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="85" fill="#0f172a" stroke="#c8102e" strokeWidth="10" />
      <circle cx="100" cy="100" r="68" fill="none" stroke="#00732f" strokeWidth="6" />
      <path d="M62 128 L88 88 L112 106 L146 62" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M146 62 L146 88 M146 62 L120 62" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}