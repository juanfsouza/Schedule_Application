'use client';

import { Button } from '@/app/components/ui/button';
import { User, ArrowLeft, ArrowRight, Search, Plus } from 'lucide-react';
import AddCalendarDialog from './AddCalendarDialog';
import AddEventDialog from './AddEventDialog';
import AddRecurrenceDialog from './AddRecurrenceDialog';
import SetWorkingHoursDialog from './SetWorkingHoursDialog';
import Categories from './Categories';
import EventDetailsDialog from './EventDetailsDialog';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import useCalendarStore, { Event, Calendar } from '@/app/store/calendarStore';

interface User {
  id: string;
  name: string;
}

type MainContentProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  user: User | null;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  onResetEvent: () => void;
  getEventById: (id: string) => Promise<Event | null>;
};

export default function MainContent({
  date,
  setDate,
  onPrevMonth,
  onNextMonth,
  user,
  selectedEventId,
  setSelectedEventId,
  onResetEvent,
  getEventById,
}: MainContentProps) {

  const { isLoading, calendars, events, fetchEvents, fetchCalendars, updateEventAPI, deleteEventAPI } = useCalendarStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const currentDate = new Date();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Referencias para sincronizar scroll
  const timeColumnRef = useRef<HTMLDivElement>(null);
  const calendarGridRef = useRef<HTMLDivElement>(null);

  // Sync selectedDate with date prop
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchEvents(), fetchCalendars()]);
    };
    loadInitialData();
  }, [fetchEvents, fetchCalendars]);

  // Função para buscar evento por ID
  const handleEventClick = async (eventId: string) => {
    const event = await getEventById(eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedEventId(eventId);
    } else {
      toast.error('Erro ao carregar detalhes do evento.');
    }
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHour < 0 || currentHour > 23) {
      return null;
    }

    const slotIndex = currentHour;
    const pixelsPerMinute = 64 / 60;
    const topPosition = slotIndex * 64 + currentMinutes * pixelsPerMinute;
    return topPosition;
  };

  const currentTimePosition = getCurrentTimePosition();

  const handleUpdateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
      await updateEventAPI(eventId, eventData);
      toast.success('Evento atualizado com sucesso');
      setSelectedEvent(null);
      onResetEvent();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) {
      toast.error('Nenhum evento selecionado para excluir.');
      return;
    }
    try {
      await deleteEventAPI(selectedEvent.id);
      toast.success('Evento excluído com sucesso');
      setSelectedEvent(null);
      onResetEvent();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento.');
    }
  };

  const handleCalendarScroll = () => {
    if (calendarGridRef.current && timeColumnRef.current) {
      timeColumnRef.current.scrollTop = calendarGridRef.current.scrollTop;
    }
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return {
      time24: `${hour.toString().padStart(2, '0')}:00`,
      display: `${displayHour} ${ampm}`,
    };
  });

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(selectedDate || currentDate);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
        if (currentView === 'week') {
          const eventDate = new Date(event.startTime);
          return (
            weekDays.some((day) => eventDate.toDateString() === day.toDateString()) &&
            (searchQuery === '' || event.title.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        } else {
          const eventDate = new Date(event.startTime).toDateString();
          return (
            eventDate === selectedDate?.toDateString() &&
            (searchQuery === '' || event.title.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
      })
    : [];

  const handlePrevPeriod = () => {
    if (currentView === 'week') {
      setSelectedDate((prev) => {
        const newDate = new Date(prev || currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setDate(newDate);
        return newDate;
      });
    } else {
      setSelectedDate((prev) => {
        const newDate = new Date(prev || currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setDate(newDate);
        return newDate;
      });
    }
  };

  const handleNextPeriod = () => {
    if (currentView === 'week') {
      setSelectedDate((prev) => {
        const newDate = new Date(prev || currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setDate(newDate);
        return newDate;
      });
    } else {
      setSelectedDate((prev) => {
        const newDate = new Date(prev || currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setDate(newDate);
        return newDate;
      });
    }
  };

  const getDateRangeText = () => {
    if (currentView === 'week') {
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];
      const monthYear = firstDay.toLocaleDateString('default', { month: 'long', year: 'numeric' });
      return `${firstDay.getDate()} - ${lastDay.getDate()}, ${monthYear}`;
    }
    return selectedDate?.toLocaleDateString('default', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading && events.length === 0) {
    return (
      <div className="flex-1 h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-zinc-900 text-white flex flex-col">
      {/* Top Header */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-700 flex-shrink-0">
        <div className="flex items-center space-x-4 ml-5">
          {/* Month/Year Display */}
          <div className="relative border border-zinc-600 rounded-lg overflow-hidden w-16 h-16 flex flex-col">
            <div className="bg-zinc-700 text-center py-1 px-2">
              <div className="text-xs text-zinc-300 uppercase font-medium">
                {(selectedDate || currentDate).toLocaleDateString('default', { month: 'short' })}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-xl font-bold text-white">
                {(selectedDate || currentDate).getDate()}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-xl font-semibold">
              {(selectedDate || currentDate).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-sm text-zinc-400">{getDateRangeText()}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800 border border-zinc-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setSelectedDate(today);
                setDate(today);
              }}
              className="bg-zinc-800 border-zinc-600 hover:bg-zinc-700 text-zinc-400 hover:text-white"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPeriod}
              className="bg-zinc-800 border-zinc-600 hover:bg-zinc-700 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPeriod}
              className="bg-zinc-800 border-zinc-600 hover:bg-zinc-700 text-zinc-400 hover:text-white"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Buttons */}
          <div className="flex bg-zinc-800 rounded-lg p-1">
            {['Day', 'Week', 'Month'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view.toLowerCase() as 'day' | 'week' | 'month')}
                className={`px-3 py-1 text-sm rounded ${
                  currentView === view.toLowerCase() ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {view} view
              </button>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 ml-10">
            <span className="text-sm">{user?.name || 'Loading...'}</span>
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Buttons Section */}
      <div className="px-4 py-3 border-b border-zinc-700 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <AddCalendarDialog
              calendars={calendars}
              onSubmit={async (data: any) => {
                console.log('Criar calendário:', data);
              }}
            />
            <AddEventDialog calendars={calendars} />
            <AddRecurrenceDialog selectedEventId={selectedEventId} />
            <SetWorkingHoursDialog />
          </div>
        </div>
        <div className="mt-3">
          <Categories />
        </div>
      </div>

      {/* Calendar Container */}
      <div className="flex-1 min-h-0 bg-zinc-900">
        {/* Week Day Headers */}
        {currentView === 'week' && (
          <div className="flex border-b border-zinc-700 bg-zinc-900 flex-shrink-0 mr-3">
            <div className="w-20 flex-shrink-0 bg-zinc-900"></div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="flex-1 p-4 text-center border-r border-zinc-700 last:border-r-0 bg-zinc-900"
              >
                <div className="text-xs text-zinc-400 uppercase">{dayNames[index]}</div>
                <div
                  className={`text-lg font-semibold ${
                    day.toDateString() === new Date().toDateString() ? 'text-blue-400' : 'text-white'
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scrollable Calendar Body */}
        <div className="flex h-full relative bg-zinc-900">
          {/* Time Column */}
          <div
            ref={timeColumnRef}
            className="w-20 bg-zinc-900 border-r border-zinc-700 overflow-hidden absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          >
            <div className="bg-zinc-900">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="h-16 flex items-start justify-end pr-2 pt-1 text-xs text-zinc-400 border-b border-zinc-800 bg-zinc-900"
                >
                  {index === 0 ? '' : slot.display}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div
            ref={calendarGridRef}
            className="flex-1 overflow-y-auto bg-zinc-900 ml-20 relative"
            onScroll={handleCalendarScroll}
          >
            {/* Current Time Line */}
            {currentTimePosition !== null && (
              <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: `${currentTimePosition}px` }}>
                <div
                  className="w-full h-0.5"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #f86262bc 1px, transparent 1px)',
                    backgroundSize: '12px 2px',
                    backgroundRepeat: 'repeat-x',
                    height: '2px',
                  }}
                >
                  <div className="absolute left-2 top-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/2"></div>
                </div>
              </div>
            )}

            <div className={`grid ${currentView === 'week' ? 'grid-cols-7' : 'grid-cols-1'} bg-zinc-900`}>
              {(currentView === 'week' ? weekDays : [selectedDate || currentDate]).map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-zinc-700 last:border-r-0 bg-zinc-900">
                  {timeSlots.map((slot, timeIndex) => {
                    const dayEvents = filteredEvents.filter((event) => {
                      const eventDate = new Date(event.startTime);
                      const eventHour = eventDate.getHours();
                      const slotHour = timeIndex;
                      return eventDate.toDateString() === day.toDateString() && eventHour === slotHour;
                    });

                    return (
                      <div
                        key={timeIndex}
                        className="h-16 border-b border-zinc-800 relative hover:bg-zinc-800 cursor-pointer bg-zinc-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dayEvents.length > 0) {
                            handleEventClick(dayEvents[0].id);
                          }
                        }}
                      >
                        {dayEvents.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="absolute top-1 left-1 right-1 rounded px-2 py-1 text-xs font-medium text-white cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: event.color || '#3b82f6', zIndex: 10 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event.id);
                            }}
                          >
                            <div className="truncate">{event.title}</div>
                            <div className="text-xs opacity-80">
                              {new Date(event.startTime).toLocaleTimeString('default', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        calendars={calendars}
        onClose={() => setSelectedEvent(null)}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}