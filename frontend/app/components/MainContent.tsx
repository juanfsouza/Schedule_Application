'use client';

import { Button } from '@/app/components/ui/button';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import AddCalendarDialog from './AddCalendarDialog';
import AddEventDialog from './AddEventDialog';
import AddRecurrenceDialog from './AddRecurrenceDialog';
import SetWorkingHoursDialog from './SetWorkingHoursDialog';
import Categories from './Categories';
import EventDetailsDialog from './EventDetailsDialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  const getCalendarDays = (d: Date | undefined) => {
    if (!d) return [];
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();

    const days = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month, -i);
      days.push({ date: prevMonthDate, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const totalDays = days.length;
    for (let i = 1; i <= 42 - totalDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const days = getCalendarDays(date);
  const currentDate = new Date('2025-06-29T23:52:00-03:00'); // Updated to current time

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEventClick = async (eventId: string) => {
    setIsLoading(true);
    const event = await getEventById(eventId);
    if (event) {
      setSelectedEvent(event);
    } else {
      toast.error('Failed to load event details.');
    }
    setIsLoading(false);
  };

  const handleDeleteEvent = () => {
    setSelectedEvent(null);
    onResetEvent();
  };

  // Reset selected event when dialog is closed manually
  useEffect(() => {
    if (!selectedEvent && !isLoading) {
      setSelectedEvent(null); // Ensure it’s cleared
    }
  }, [selectedEvent, isLoading]);

  return (
    <div className="flex-1 p-4 overflow-auto bg-gray-50">
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
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-semibold text-gray-600 border-1 rounded-md">
              {day}
            </div>
          ))}
          {days.map((dayObj, index) => {
            const isToday = dayObj.date.toDateString() === currentDate.toDateString();
            const isSelected = date && dayObj.date.toDateString() === date.toDateString();
            const dayEvents = events.filter((e) => new Date(e.startTime).toDateString() === dayObj.date.toDateString());

            return (
              <div
                key={index}
                onClick={() => setDate(dayObj.date)}
                className={`p-2 rounded-lg border border-gray-200 hover:bg-zinc-200/50 focus:outline-none cursor-pointer h-42 flex flex-col items-start justify-start ${
                  !dayObj.isCurrentMonth ? 'text-black' : ''
                } ${isToday ? 'bg-purple-300/20 text-black' : ''} ${isSelected ? 'bg-zinc-300/30 text-black' : ''}`}
              >
                <div className="text-lg font-medium mb-1">{dayObj.date.getDate()}</div>
                {dayEvents.length > 0 && (
                  <div className="text-xs text-white overflow-hidden w-full">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event.id);
                        }}
                        className="p-1 bg-opacity-70 rounded cursor-pointer"
                        style={{ backgroundColor: event.color || '#3b82f6' }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <EventDetailsDialog
        event={isLoading ? null : selectedEvent} // Show null while loading
        calendars={calendars}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}