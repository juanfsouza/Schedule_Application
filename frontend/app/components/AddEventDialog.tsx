'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const createEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
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

type EventFormData = z.infer<typeof createEventSchema>;

type AddEventDialogProps = {
  calendars: any[];
};

export default function AddEventDialog({ calendars }: AddEventDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      allDay: false,
      color: '#00ff00',
      calendarId: calendars.length > 0 ? calendars[0].id : '',
      location: '',
      type: 'APPOINTMENT',
      status: 'CONFIRMED',
      isRecurring: false,
    },
  });

  const onSubmitEvent = async (data: EventFormData) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const isoStartTime = start.toISOString();
      const isoEndTime = end.toISOString();
      const res = await fetch(`${baseUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...data, startTime: isoStartTime, endTime: isoEndTime }),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success('Event created');
        reset();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Event creation error:', error);
      toast.error('Failed to create event');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitEvent)} className="space-y-4">
          <Input {...register('title')} placeholder="Event Title" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          <Input {...register('description')} placeholder="Description" />
          <Input {...register('startTime')} type="datetime-local" step="900" />
          {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
          <Input {...register('endTime')} type="datetime-local" step="900" />
          {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
          <label className="flex items-center">
            <Input {...register('allDay')} type="checkbox" />
            <span className="ml-2">All Day</span>
          </label>
          <Input {...register('color')} type="color" />
          <Input {...register('location')} placeholder="Location" />
          <select {...register('calendarId')} className="w-full p-2 border rounded">
            {calendars.map((cal) => (
              <option key={cal.id} value={cal.id}>{cal.name}</option>
            ))}
          </select>
          <select {...register('type')} className="w-full p-2 border rounded">
            {['APPOINTMENT', 'MEETING', 'BIRTHDAY', 'REMINDER', 'TASK', 'OTHER'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select {...register('status')} className="w-full p-2 border rounded">
            {['CONFIRMED', 'TENTATIVE', 'CANCELLED'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <label className="flex items-center">
            <Input {...register('isRecurring')} type="checkbox" />
            <span className="ml-2">Recurring</span>
          </label>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}