import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  starterOptions,
  mainCourseOptions,
  dessertOptions,
} from "@/data/reunion-config";

export interface GuestData {
  name: string;
  attending: "yes" | "no" | "";
  starter: string;
  mainCourse: string;
  dessert: string;
}

interface GuestRowProps {
  index: number;
  guest: GuestData;
  isPrimary: boolean;
  isDelegated?: boolean;
  onChange: (index: number, data: Partial<GuestData>) => void;
  onRemove?: (index: number) => void;
}

export function GuestRow({ index, guest, isPrimary, isDelegated, onChange, onRemove }: GuestRowProps) {
  const showMealOptions = guest.attending === "yes";

  return (
    <div className="reunion-guest-row">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {isPrimary || isDelegated ? (
            <h3 className="reunion-heading text-base">{guest.name}</h3>
          ) : (
            <Input
              value={guest.name}
              onChange={(e) => onChange(index, { name: e.target.value })}
              placeholder="Guest name"
              className="reunion-input max-w-[200px] text-sm"
            />
          )}
          {isPrimary && (
            <span className="reunion-badge">You</span>
          )}
          {isDelegated && (
            <span className="reunion-badge-delegated">Delegated</span>
          )}
        </div>
        {!isPrimary && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="reunion-remove-btn"
            aria-label="Remove guest"
          >
            &times;
          </button>
        )}
      </div>

      {/* Attending */}
      <div className="mb-4">
        <Label className="reunion-label text-xs mb-2 block">Attending?</Label>
        <RadioGroup
          value={guest.attending}
          onValueChange={(v) =>
            onChange(index, {
              attending: v as "yes" | "no",
              ...(v === "no" ? { starter: "", mainCourse: "", dessert: "" } : {}),
            })
          }
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id={`attend-yes-${index}`} className="reunion-radio" />
            <Label htmlFor={`attend-yes-${index}`} className="reunion-body text-sm cursor-pointer">
              Yes, I&rsquo;ll be there!
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id={`attend-no-${index}`} className="reunion-radio" />
            <Label htmlFor={`attend-no-${index}`} className="reunion-body text-sm cursor-pointer">
              Sorry, can&rsquo;t make it
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Meal selections — only shown if attending */}
      {showMealOptions && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reunion-meal-fade">
          <div>
            <Label className="reunion-label text-xs mb-1.5 block">Starter</Label>
            <Select
              value={guest.starter}
              onValueChange={(v) => onChange(index, { starter: v })}
            >
              <SelectTrigger className="reunion-select">
                <SelectValue placeholder="Choose starter" />
              </SelectTrigger>
              <SelectContent className="reunion-select-content">
                {starterOptions.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)} className="reunion-select-item">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="reunion-label text-xs mb-1.5 block">Main Course</Label>
            <Select
              value={guest.mainCourse}
              onValueChange={(v) => onChange(index, { mainCourse: v })}
            >
              <SelectTrigger className="reunion-select">
                <SelectValue placeholder="Choose main" />
              </SelectTrigger>
              <SelectContent className="reunion-select-content">
                {mainCourseOptions.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)} className="reunion-select-item">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="reunion-label text-xs mb-1.5 block">Dessert</Label>
            <Select
              value={guest.dessert}
              onValueChange={(v) => onChange(index, { dessert: v })}
            >
              <SelectTrigger className="reunion-select">
                <SelectValue placeholder="Choose dessert" />
              </SelectTrigger>
              <SelectContent className="reunion-select-content">
                {dessertOptions.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)} className="reunion-select-item">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
