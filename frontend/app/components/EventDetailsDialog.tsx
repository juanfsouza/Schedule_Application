'use client';

import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const updateEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  allDay: z.boolean(),
  color: z.string().optional(),
  calendarId: z.string().uuid(),
  location: z.string().optional(),
  type: z.enum(['APPOINTMENT', 'MEETING', 'BIRTHDAY', 'REMINDER', 'TASK', 'OTHER']).optional(),
  status: z.enum(['CONFIRMED', 'TENTATIVE', 'CANCELLED']).optional(),
  isRecurring: z.boolean().optional(),
}).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
  message: 'Start time must be before end time',
  path: ['startTime'],
});

type UpdateEventFormData = z.infer<typeof updateEventSchema>;

type EventDetailsDialogProps = {
  event: any;
  calendars: any[];
  onClose: () => void;
  onDelete: () => void;
};

export default function EventDetailsDialog({ event, calendars, onClose, onDelete }: EventDetailsDialogProps) {
  // Only initialize form if event is valid
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UpdateEventFormData>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: event
      ? {
          title: event.title || '',
          description: event.description || '',
          startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
          endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
          allDay: event.allDay || false,
          color: event.color || '#6fff6f',
          calendarId: event.calendarId || (calendars.length > 0 ? calendars[0].id : ''),
          location: event.location || '',
          type: event.type || 'APPOINTMENT',
          status: event.status || 'CONFIRMED',
          isRecurring: event.isRecurring || false,
        }
      : {},
  });

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const onSubmitUpdate = async (data: UpdateEventFormData) => {
    const token = getToken();
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      router.push('/auth');
      return;
    }

    if (!event?.id) {
      toast.error('No event selected for update.');
      return;
    }

    try {
      const start = new Date(data.startTime + ':00-03:00');
      const end = new Date(data.endTime + ':00-03:00');
      const isoStartTime = start.toISOString();
      const isoEndTime = end.toISOString();

      const res = await fetch(`${baseUrl}/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, startTime: isoStartTime, endTime: isoEndTime }),
      });
      if (res.ok) {
        toast.success('Event updated');
        onClose();
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please log in again.');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        router.push('/auth');
      } else if (res.status === 409) {
        const error = await res.json();
        toast.error(error.message || 'Failed to update event: Calendar in use');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      router.push('/auth');
      return;
    }

    if (!event?.id) {
      toast.error('No event selected for deletion.');
      return;
    }

    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this event?')) {
      try {
        const res = await fetch(`${baseUrl}/events/${event.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          toast.success('Event deleted');
          onDelete();
          onClose();
        } else if (res.status === 401) {
          toast.error('Unauthorized. Please log in again.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          router.push('/auth');
        } else {
          const error = await res.json();
          toast.error(error.message || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  if (!event) return null; // Prevent rendering if no event

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] bg-white rounded-xl shadow-2xl p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">Event Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                {...register('title')}
                placeholder="Event Title"
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Input
                {...register('description')}
                placeholder="Description"
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3 md:w-100 sm:grid-cols-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <Input
                  {...register('startTime')}
                  type="datetime-local"
                  step="900"
                  className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                />
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <Input
                  {...register('endTime')}
                  type="datetime-local"
                  step="900"
                  className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                />
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input {...register('allDay')} type="checkbox" className="h-4 w-4 text-zinc-600 border-gray-300 rounded focus:ring-zinc-500" />
              <label className="text-sm font-medium text-gray-700">All Day</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <Input
                {...register('color')}
                type="color"
                className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Select
                onValueChange={(value) => setValue('location', value)}
                defaultValue={event.location || ''}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calendar</label>
              <Select
                onValueChange={(value) => setValue('calendarId', value)}
                defaultValue={event.calendarId || (calendars.length > 0 ? calendars[0].id : '')}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                  <SelectValue placeholder="Select calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.map((cal) => (
                    <SelectItem key={cal.id} value={cal.id}>{cal.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.calendarId && <p className="text-yellow-600 text-sm mt-1">{errors.calendarId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select
                onValueChange={(value: 'APPOINTMENT' | 'MEETING' | 'BIRTHDAY' | 'REMINDER' | 'TASK' | 'OTHER') => setValue('type', value)}
                defaultValue={event.type || 'APPOINTMENT'}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {['APPOINTMENT', 'MEETING', 'BIRTHDAY', 'REMINDER', 'TASK', 'OTHER'].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                onValueChange={(value: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED') => setValue('status', value)}
                defaultValue={event.status || 'CONFIRMED'}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['CONFIRMED', 'TENTATIVE', 'CANCELLED'].map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Input {...register('isRecurring')} type="checkbox" className="h-4 w-4 text-zinc-600 border-gray-300 rounded focus:ring-zinc-500" />
              <label className="text-sm font-medium text-gray-700">Recurring</label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              Update Event
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}