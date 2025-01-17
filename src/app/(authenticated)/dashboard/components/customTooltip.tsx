function CustomTooltip({
  active,
  payload,
  label,
  customEntryValueLabel,
  entryFormat = (entry: any) => entry,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  customEntryValueLabel?: string;
  entryFormat?: (entry: any) => string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entryFormat(
              `${customEntryValueLabel || entry.name || entry.dataKey}: ${entry.value}`,
            )}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
