import { useState } from 'react';
import { Plus, X, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Child {
  id: string;
  birthdate: string;
  gender: string;
  custody: number;
}

interface ChildrenManagerProps {
  children: Child[];
  onChange: (children: Child[]) => void;
}

export function ChildrenManager({ children, onChange }: ChildrenManagerProps) {
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const { t } = useLanguage();

  const genderOptions = [
    { value: 'boy', label: t.boy },
    { value: 'girl', label: t.girl },
    { value: 'other', label: t.other },
  ];

  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      birthdate: new Date(new Date().getFullYear() - 5, 0, 1).toISOString().split('T')[0],
      gender: 'boy',
      custody: 50,
    };
    onChange([...children, newChild]);
    setEditingChild(newChild.id);
  };

  const updateChild = (id: string, updates: Partial<Child>) => {
    onChange(children.map(child => child.id === id ? { ...child, ...updates } : child));
  };

  const removeChild = (id: string) => {
    onChange(children.filter(child => child.id !== id));
    setEditingChild(null);
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const formatBirthdate = (birthdate: string) => {
    const date = new Date(birthdate);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (children.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-center py-4">{t.noChildrenAdded}</p>
        <Button onClick={addChild} className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          {t.addChild}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {children.map((child, index) => (
        <div key={child.id} className="p-4 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">{t.child} {index + 1}</span>
            <button onClick={() => removeChild(child.id)} className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors">
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.gender}
            </label>
            <div className="flex gap-2">
              {genderOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateChild(child.id, { gender: option.value })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    child.gender === option.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t.birthdate}
            </label>
            <input
              type="date"
              value={child.birthdate}
              onChange={(e) => updateChild(child.id, { birthdate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {child.birthdate && (
              <p className="text-sm text-muted-foreground">
                {formatBirthdate(child.birthdate)} ({calculateAge(child.birthdate)} {t.yearsOld})
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">{t.custody}: {child.custody}%</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={child.custody}
              onChange={(e) => updateChild(child.id, { custody: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addChild} className="w-full" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        {t.addAnotherChild}
      </Button>
    </div>
  );
}