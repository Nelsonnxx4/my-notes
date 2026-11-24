interface BrandMarkProps {
  className?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({ className = "h-7 w-7" }) => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 32 32">
    <path
      d="M7.5 3.5h11l6 6v18h-17v-24Z"
      fill="var(--app-surface)"
      stroke="var(--app-text)"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
    <path
      d="M18.5 3.5v6h6"
      stroke="var(--app-text)"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
    <path
      d="M11 15.25h9.5M11 19.25h7M11 23.25h4.5"
      stroke="var(--app-muted)"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M8 12.5V24"
      stroke="var(--app-focus)"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);

export default BrandMark;
