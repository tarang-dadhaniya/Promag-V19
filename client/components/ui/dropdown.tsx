import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L5 5L9 1" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  className?: string;
  disabled?: boolean;
}

export function Dropdown({ placeholder, value, onChange, options, className, disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        className={cn(
          "flex h-[42px] px-[14px] py-2.5 justify-between items-center self-stretch",
          "rounded border border-promag-input-border bg-white transition-colors",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-promag-primary/50",
          isOpen && "border-promag-primary",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn(
          "font-inter text-sm font-normal",
          selectedOption ? "text-promag-body" : "text-promag-placeholder"
        )}>
          {selectedOption?.label || placeholder}
        </span>
        <div className={cn(
          "transition-transform duration-200",
          isOpen && "rotate-180"
        )}>
          <ChevronDown />
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute top-[44px] left-0 right-0 z-50 bg-white border border-promag-input-border rounded shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-[14px] py-2.5 text-promag-placeholder font-inter text-sm">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full px-[14px] py-2.5 text-left font-inter text-sm hover:bg-promag-background transition-colors",
                  option.value === value 
                    ? "bg-promag-primary/10 text-promag-primary font-medium" 
                    : "text-promag-body"
                )}
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
