import { Check } from 'lucide-react';

interface ChipSelectorProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxSelections?: number;
  columns?: 2 | 3 | 4;
}

export function ChipSelector({ 
  options, 
  value, 
  onChange, 
  multiple = false,
  maxSelections,
  columns = 3
}: ChipSelectorProps) {
  const selectedValues = Array.isArray(value) ? value : [value];
  
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const isSelected = selectedValues.includes(optionValue);
      if (isSelected) {
        onChange(selectedValues.filter(v => v !== optionValue));
      } else if (!maxSelections || selectedValues.length < maxSelections) {
        onChange([...selectedValues, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  const gridClass = columns === 2 
    ? 'grid-cols-2' 
    : columns === 4 
      ? 'grid-cols-4' 
      : 'grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`relative py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            {option.icon && <span className="mr-1.5">{option.icon}</span>}
            {option.label}
            {isSelected && multiple && (
              <Check className="absolute top-1 right-1 w-3 h-3" />
            )}
          </button>
        );
      })}
    </div>
  );
}
