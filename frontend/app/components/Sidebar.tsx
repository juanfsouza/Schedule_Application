'use client';

import { Button } from '@/app/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CalendarComponent from './CalendarComponent';

type SidebarProps = {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  events: any[];
};

export default function Sidebar({ date, onDateSelect, events }: SidebarProps) {
  const router = useRouter();

  return (
    <div className="w-84 bg-white shadow-lg p-3">
      <div className="flex items-center space-x-2 mb-6">
        <CalendarIcon className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold">My Calendar</h2>
      </div>
      <div className="mb-4 overflow-auto max-h-[400px] rounded-2xl">
        <CalendarComponent date={date} onSelect={onDateSelect} events={events} />
        {events.length === 0 && <p className="text-red-500 text-sm">No events loaded</p>}
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">My Schedules</h3>
        <div className="space-y-1">
          {['Daily Standup', 'Weekly Review', 'Team Meeting', 'Lunch Break', 'Client Meeting', 'Other'].map((schedule) => (
            <Button key={schedule} variant="ghost" className="w-full justify-start text-sm">
              <span className="ml-2">{schedule}</span>
            </Button>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2">
            <Plus className="mr-2 h-4 w-4" /> Add Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}