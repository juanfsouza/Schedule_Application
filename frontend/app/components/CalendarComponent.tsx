'use client';

import { Calendar } from '@/app/components/ui/calendar';
import { useState } from 'react';

type CalendarComponentProps = {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  events: any[];
};

export default function CalendarComponent({ date, onSelect, events }: CalendarComponentProps) {
  const [selected, setSelected] = useState<Date | undefined>(date);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onSelect(date);
  };

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      showOutsideDays={true}
      captionLayout="dropdown"
      className=""
      modifiers={{
        events: events.map((e) => new Date(e.startTime)),
      }}
      modifiersStyles={{
        events: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '0.75rem',
          padding: '0px',
          margin: '2px',
          borderRadius: '5px',
        },
      }}
    />
  );
}