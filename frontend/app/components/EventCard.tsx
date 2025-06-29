'use client';

import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

type EventCardProps = {
  event: any;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  onResetEvent: () => void;
  getEventById: (id: string) => Promise<any | null>;
};

export default function EventCard({ event, selectedEventId, setSelectedEventId, onResetEvent, getEventById }: EventCardProps) {
  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const eventData = await getEventById(event.id);
    if (eventData) {
      onResetEvent();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const res = await fetch(`${baseUrl}/events/${event.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Event deleted');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <div
      className="mt-2 p-3 rounded-t-lg border border-gray-200 shadow-sm flex justify-between items-start"
      style={{ backgroundColor: event.color || '#3b82f6' }}
      onClick={() => setSelectedEventId(event.id)}
    >
      <div>
        <div className="text-sm font-medium text-white mb-1">{event.title}</div>
        <div className="text-xs text-white mb-1">
          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
          {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        {event.description && <div className="text-xs text-white italic">{event.description}</div>}
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}