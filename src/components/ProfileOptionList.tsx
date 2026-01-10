import { useState, useMemo } from 'react';
import { Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileOptionListProps {
  options: { value: string; label: string; description?: string }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxSelections?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showSaveButton?: boolean;
  onSave?: () => void;
}

export function ProfileOptionList({ 
  options, 
  value, 
  onChange, 
  multiple = false,
  maxSelections,
  showSearch = false,
  searchPlaceholder = 'Search...',
  showSaveButton = false,
  onSave,
}: ProfileOptionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);
  
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);
  
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

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      {showSearch && (
        <div className="px-0 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-3 rounded-lg bg-secondary/50 border-none focus:outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* Options list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredOptions.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full py-4 px-4 rounded-2xl text-center transition-all ${
                isSelected
                  ? 'border-2 border-foreground bg-background'
                  : 'border border-border bg-secondary/50 hover:bg-secondary'
              }`}
            >
              <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                {option.label}
              </span>
              {option.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Save button */}
      {showSaveButton && (
        <div className="pt-4 mt-auto">
          <Button 
            onClick={onSave} 
            className="w-full py-6 text-base font-semibold rounded-xl"
          >
            Save{multiple && selectedValues.length > 0 && ` (${selectedValues.length}${maxSelections ? `/${maxSelections}` : ''})`}
          </Button>
        </div>
      )}
    </div>
  );
}