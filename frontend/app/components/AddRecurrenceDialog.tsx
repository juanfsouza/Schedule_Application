'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ShinyButton } from './ui/shiny-button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import useCalendarStore, { Recurrence } from '@/app/store/calendarStore';

const createRecurrenceSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.number().min(1, { message: 'Interval must be at least 1' }),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  endDate: z.string().datetime().optional(),
  count: z.number().min(1, { message: 'Count must be at least 1' }).optional(),
}).refine(
  (data) => !data.count || !data.endDate || data.count > 0,
  { message: 'Cannot have both count and end date with invalid values', path: ['count'] }
);

type RecurrenceFormData = z.infer<typeof createRecurrenceSchema>;

type AddRecurrenceDialogProps = {
  selectedEventId: string | null;
};

export default function AddRecurrenceDialog({ selectedEventId }: AddRecurrenceDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateEventAPI } = useCalendarStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RecurrenceFormData>({
    resolver: zodResolver(createRecurrenceSchema),
    defaultValues: {
      frequency: 'DAILY',
      interval: 1,
      daysOfWeek: [],
      endDate: undefined,
      count: undefined,
    },
  });

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const onSubmitRecurrence = async (data: RecurrenceFormData) => {
    if (!selectedEventId) {
      toast.error('No event selected for recurrence.');
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      window.location.href = '/auth';
      return;
    }

    try {
      const recurrenceData: Recurrence = {
        frequency: data.frequency,
        interval: data.interval,
        daysOfWeek: data.daysOfWeek,
        endDate: data.endDate ? new Date(data.endDate + ':00-03:00').toISOString() : undefined,
        count: data.count,
      };

      // Update event with recurrence data via Zustand store
      await updateEventAPI(selectedEventId, { recurrence: recurrenceData });

      toast.success('Recurrence added successfully');
      reset();
      setOpen(false); // Close the dialog on successful submission
    } catch (error) {
      console.error('Recurrence creation error:', error);
      toast.error('Failed to add recurrence');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ShinyButton disabled={!selectedEventId}>
          <div className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Recurrence
          </div>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[70vh] bg-white rounded-xl shadow-2xl p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">Add Recurrence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitRecurrence)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <Select
              onValueChange={(value: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') => setValue('frequency', value)}
              defaultValue="DAILY"
            >
              <SelectTrigger className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq.charAt(0) + freq.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
            <Input
              {...register('interval', { valueAsNumber: true })}
              type="number"
              placeholder="e.g., 1 for every day/week/month"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
            {errors.interval && <p className="text-red-500 text-sm mt-1">{errors.interval.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
            <Input
              {...register('endDate')}
              type="datetime-local"
              step="900"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occurrences (Optional)</label>
            <Input
              {...register('count', { valueAsNumber: true })}
              type="number"
              placeholder="e.g., 10 for 10 occurrences"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
            {errors.count && <p className="text-red-500 text-sm mt-1">{errors.count.message}</p>}
          </div>
          <Button type="submit" className="w-full">
            Add Recurrence
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}