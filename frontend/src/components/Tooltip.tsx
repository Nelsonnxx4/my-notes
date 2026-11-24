import { useEffect, useRef, useState, type ReactNode } from "react";

let tooltipsAreWarm = false;
let warmTimer: number | undefined;

interface TooltipProps {
  label: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<number>();

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
    },
    [],
  );

  const show = () => {
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(
      () => {
        tooltipsAreWarm = true;
        setOpen(true);
      },
      tooltipsAreWarm ? 0 : 450,
    );
  };

  const hide = () => {
    window.clearTimeout(openTimer.current);
    setOpen(false);
    window.clearTimeout(warmTimer);
    warmTimer = window.setTimeout(() => {
      tooltipsAreWarm = false;
    }, 900);
  };

  return (
    <span
      className="relative inline-flex"
      onBlur={hide}
      onFocus={show}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <span className="ui-tooltip" data-open={open} role="tooltip">
        {label}
      </span>
    </span>
  );
};

export default Tooltip;
