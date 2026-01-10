import { Slider } from '@/components/ui/slider';

interface ProfileSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  labels?: string[];
  unit?: string;
  showValue?: boolean;
}

export function ProfileSlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  labels,
  unit = '',
  showValue = true
}: ProfileSliderProps) {
  const displayValue = labels ? labels[value] : `${value}${unit}`;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {showValue && (
          <span className="text-sm font-semibold text-primary">{displayValue}</span>
        )}
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      {labels && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
