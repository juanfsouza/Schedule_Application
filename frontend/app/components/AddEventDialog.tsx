'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useRouter } from 'next/navigation';
import { ShinyButton } from './ui/shiny-button';
import useCalendarStore, { Calendar, Event } from '@/app/store/calendarStore';

const categories = [
  { name: 'Work', bgColor: 'rgba(34, 197, 94, 0.7)', border: '2px', borderColor: 'rgb(21, 128, 61)' },
  { name: 'Personal', bgColor: 'rgba(139, 92, 246, 0.7)', borderColor: 'rgb(91, 60, 161)' },
  { name: 'Schedule', bgColor: 'rgba(59, 130, 246, 0.7)', borderColor: 'rgb(39, 86, 163)' },
  { name: 'Gaming', bgColor: 'rgba(234, 179, 8, 0.7)', borderColor: 'rgb(154, 118, 5)' },
];

const createEventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100),
  description: z.string().optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  allDay: z.boolean(),
  color: z.enum(categories.map((c) => c.bgColor) as [string, ...string[]]).optional(),
  calendarId: z.string().uuid(),
  location: z.string().optional(),
  type: z.enum(['APPOINTMENT', 'MEETING', 'BIRTHDAY', 'REMINDER', 'TASK', 'OTHER']).optional(),
  status: z.enum(['CONFIRMED', 'TENTATIVE', 'CANCELLED']).optional(),
  isRecurring: z.boolean().optional(),
  attendees: z
    .array(
      z.object({
        email: z.string().email(),
        name: z.string().min(2).max(100).optional(),
        status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'TENTATIVE']).default('PENDING'),
        role: z.enum(['ORGANIZER', 'ATTENDEE', 'OPTIONAL']).default('ATTENDEE'),
      })
    )
    .default([]),
}).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
  message: 'Start time must be before end time',
  path: ['startTime'],
});

type EventFormData = z.infer<typeof createEventSchema>;

type AddEventDialogProps = {
  calendars: Calendar[];
};

export default function AddEventDialog({ calendars }: AddEventDialogProps) {
  const { createEventAPI } = useCalendarStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
    control,
  } = useForm<EventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: new Date('2025-06-29T23:27:00-03:00').toISOString().slice(0, 16),
      endTime: new Date('2025-06-30T00:27:00-03:00').toISOString().slice(0, 16),
      allDay: false,
      color: categories[0].bgColor, // Default to Work category
      calendarId: calendars.length > 0 ? calendars[0].id : '',
      location: '',
      type: 'APPOINTMENT',
      status: 'CONFIRMED',
      isRecurring: false,
      attendees: [{ email: '', name: '', status: 'PENDING', role: 'ATTENDEE' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attendees',
  });

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const onSubmitEvent = async (data: EventFormData) => {
    const token = getToken();
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      router.push('/auth');
      return;
    }

    try {
      // Create event using Zustand store
      const eventData: Omit<Event, 'id'> = {
        ...data,
        startTime: new Date(data.startTime + ':00-03:00').toISOString(),
        endTime: new Date(data.endTime + ':00-03:00').toISOString(),
      };
      await createEventAPI(eventData);

      // Handle attendees
      if (data.attendees && data.attendees.length > 0) {
        const eventId = useCalendarStore.getState().events.find(
          (e) => e.title === data.title && e.startTime === eventData.startTime
        )?.id;
        if (!eventId) {
          toast.error('Failed to retrieve created event ID');
          return;
        }

        for (const attendee of data.attendees) {
          if (attendee.email && attendee.name) {
            const attendeeRes = await fetch(`${baseUrl}/attendees`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                eventId,
                email: attendee.email,
                name: attendee.name,
                status: attendee.status,
                role: attendee.role,
              }),
            });
            if (!attendeeRes.ok) {
              const error = await attendeeRes.json();
              toast.error(error.message || 'Failed to add attendee');
              return;
            }
          }
        }
        toast.success('Attendees added');
      }

      toast.success('Event created');
      reset();
    } catch (error) {
      console.error('Event creation error:', error);
      toast.error('Failed to create event');
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        router.push('/auth');
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ShinyButton>
          <div className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </div>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[455px] max-h-[70vh] bg-white rounded-xl shadow-2xl p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitEvent)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
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
            <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
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
              <Input
                {...register('allDay')}
                type="checkbox"
                className="h-4 w-4 text-zinc-600 border-gray-300 rounded focus:ring-zinc-500"
              />
              <label className="text-sm font-medium text-gray-700">All Day</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                onValueChange={(value) => setValue('color', value)}
                defaultValue={categories[0].bgColor}
              >
                <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.bgColor}>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: category.bgColor,
                            border: `1px solid ${category.borderColor}`,
                          }}
                        ></span>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Select
                onValueChange={(value) => setValue('location', value)}
                defaultValue=""
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
                onValueChange={(value) => {
                  setValue('calendarId', value);
                  clearErrors('calendarId');
                }}
                defaultValue={calendars.length > 0 ? calendars[0].id : ''}
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
                onValueChange={(value: 'APPOINTMENT' | 'MEETING' | 'BIRTHDAY' | 'REMINDER' | 'TASK' | 'OTHER') =>
                  setValue('type', value)}
                defaultValue="APPOINTMENT"
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
                defaultValue="CONFIRMED"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 mb-2 p-2 border border-gray-200 rounded-md">
                  <Input
                    {...register(`attendees.${index}.email` as const)}
                    placeholder="Attendee Email"
                    className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                  />
                  {errors.attendees?.[index]?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.attendees[index]?.email?.message}</p>
                  )}
                  <Input
                    {...register(`attendees.${index}.name` as const)}
                    placeholder="Attendee Name"
                    className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                  />
                  {errors.attendees?.[index]?.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.attendees[index]?.name?.message}</p>
                  )}
                  <Select
                    onValueChange={(value: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE') =>
                      setValue(`attendees.${index}.status`, value)}
                    defaultValue={field.status}
                  >
                    <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {['PENDING', 'ACCEPTED', 'DECLINED', 'TENTATIVE'].map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value: 'ORGANIZER' | 'ATTENDEE' | 'OPTIONAL') =>
                      setValue(`attendees.${index}.role`, value)}
                    defaultValue={field.role}
                  >
                    <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {['ORGANIZER', 'ATTENDEE', 'OPTIONAL'].map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ email: '', name: '', status: 'PENDING', role: 'ATTENDEE' })}
              >
                Add Attendee
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                {...register('isRecurring')}
                type="checkbox"
                className="h-4 w-4 text-zinc-600 border-gray-300 rounded focus:ring-zinc-500"
              />
              <label className="text-sm font-medium text-gray-700">Recurring</label>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}