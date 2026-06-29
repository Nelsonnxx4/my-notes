const SettingField: React.FC<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {description && (
        <span className="text-xs text-gray-400 mt-0.5">{description}</span>
      )}
    </div>
    <div className="ml-4 shrink-0">{children}</div>
  </div>
);

export default SettingField;
