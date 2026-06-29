const Toggle: React.FC<{
  enabled: boolean;
  onChange: (v: boolean) => void;
}> = ({ enabled, onChange }) => (
  <button
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none
      ${enabled ? "bg-green-400" : "bg-gray-200"}`}
    onClick={() => onChange(!enabled)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
        ${enabled ? "translate-x-4" : "translate-x-0.5"}`}
    />
  </button>
);

export default Toggle;
