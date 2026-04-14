const presets = [
  'Navbar',
  'Hero',
  'Card',
  'Form',
  'Footer',
  'Data Table',
  'Chart',
];

export const ComponentLibrary = ({ onDropPreset }: { onDropPreset: (preset: string) => void }) => (
  <div className="absolute left-3 top-20 z-10 w-40 rounded-lg border border-zinc-700 bg-panel p-2">
    <h4 className="mb-2 text-xs font-semibold">Library</h4>
    <div className="space-y-1">
      {presets.map((preset) => (
        <button key={preset} onClick={() => onDropPreset(preset)} className="w-full rounded bg-zinc-800 px-2 py-1 text-left text-xs">
          {preset}
        </button>
      ))}
    </div>
  </div>
);
