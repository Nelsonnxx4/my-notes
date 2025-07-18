import type { SVGProps } from "react";

export const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg height={24} width={24} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10 18h4M11 6H3m12 0h6m-3 3V3M7 12h8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export { FilterIcon as ReactComponent };
