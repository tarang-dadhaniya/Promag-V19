import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const CalendarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.111 4.4446H2.889C1.846 4.4446 1 5.2903 1 6.3335V15.5557C1 16.5989 1.846 17.4446 2.889 17.4446H14.111C15.154 17.4446 16 16.5989 16 15.5557V6.3335C16 5.2903 15.154 4.4446 14.111 4.4446Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.277 2.5557V6.3334" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.723 2.5557V6.3334" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 10.1113H16" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface DatePickerProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ placeholder, value, onChange, className, disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [viewDate, setViewDate] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isSelected = selectedDate && 
        currentDate.getDate() === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <button
          key={day}
          className={cn(
            "w-8 h-8 text-sm rounded hover:bg-promag-primary/10 transition-colors",
            isSelected 
              ? "bg-promag-primary text-white hover:bg-promag-primary" 
              : "text-promag-body"
          )}
          onClick={() => handleDateSelect(currentDate)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div ref={datePickerRef} className="relative w-full">
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
          value ? "text-promag-body" : "text-promag-placeholder"
        )}>
          {value || placeholder}
        </span>
        <CalendarIcon />
      </div>

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div className="absolute top-[44px] left-0 z-50 bg-white border border-promag-input-border rounded shadow-lg p-4 min-w-[280px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-promag-background rounded transition-colors"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1L1 5L5 9" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="font-inter text-sm font-medium text-promag-body">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>

            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-promag-background rounded transition-colors"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L5 5L1 1" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-promag-body/60">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
}
