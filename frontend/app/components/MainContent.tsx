'use client';

import { Button } from '@/app/components/ui/button';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import AddCalendarDialog from './AddCalendarDialog';
import AddEventDialog from './AddEventDialog';
import AddRecurrenceDialog from './AddRecurrenceDialog';
import SetWorkingHoursDialog from './SetWorkingHoursDialog';
import Categories from './Categories';
import EventCard from './EventCard';

type MainContentProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  user: any;
  calendars: any[];
  events: any[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  onResetEvent: () => void;
  getEventById: (id: string) => Promise<any | null>;
};

export default function MainContent({
  date,
  setDate,
  onPrevMonth,
  onNextMonth,
  user,
  calendars,
  events,
  selectedEventId,
  setSelectedEventId,
  onResetEvent,
  getEventById,
}: MainContentProps) {
  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {date?.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
            <span>Today</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onPrevMonth}>
            <ArrowLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={onNextMonth}>
            <ArrowRight />
          </Button>
          <select className="border rounded p-1 mb-2">
            <option>Month</option>
            <option>Week</option>
          </select>
          <div className="flex space-x-2 ml-5 p-2">
            <span className="text-sm">{user?.name || 'Loading...'}</span>
            <User className="text-gray-500 bg-zinc-900 rounded-xl p-1" />
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <div className="space-y-2 space-x-3">
          <AddCalendarDialog 
            calendars={calendars} 
            onSubmit={function (data: { name: string; color: string; isDefault: boolean; isVisible: boolean; description?: string | undefined; }): Promise<void> {
              throw new Error('Function not implemented.');
            }} 
          />
          <AddEventDialog calendars={calendars} />
          <AddRecurrenceDialog selectedEventId={selectedEventId} />
          <SetWorkingHoursDialog />
        </div>
      </div>
      <div className="mt-2 mb-3">
        <Categories />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 overflow-y-auto md:col-span-3 w-full h-[calc(100vh-300px)]">
          <h2 className="text-lg font-semibold mb-4">Events for {date?.toLocaleDateString()}</h2>
          {events
            .filter((e) => new Date(e.startTime).toDateString() === date?.toDateString())
            .map((event) => (
              <EventCard
                key={event.id}
                event={event}
                selectedEventId={selectedEventId}
                setSelectedEventId={setSelectedEventId}
                onResetEvent={onResetEvent}
                getEventById={getEventById}
              />
            ))}
        </div>
      </div>
    </div>
  );
}