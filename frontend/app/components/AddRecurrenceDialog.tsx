'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const createRecurrenceSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.number().min(1),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  endDate: z.string().datetime().optional(),
  count: z.number().min(1).optional(),
});

type RecurrenceFormData = z.infer<typeof createRecurrenceSchema>;

type AddRecurrenceDialogProps = {
  selectedEventId: string | null;
};

export default function AddRecurrenceDialog({ selectedEventId }: AddRecurrenceDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecurrenceFormData>({
    resolver: zodResolver(createRecurrenceSchema),
    defaultValues: {
      frequency: 'DAILY',
      interval: 1,
      daysOfWeek: [],
      endDate: '',
      count: undefined,
    },
  });

  const onSubmitRecurrence = async (data: RecurrenceFormData) => {
    if (!selectedEventId) {
      toast.error('Please select an event');
      return;
    }
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const res = await fetch(`${baseUrl}/recurrences/${selectedEventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Recurrence added');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to add recurrence');
      }
    } catch (error) {
      console.error('Recurrence creation error:', error);
      toast.error('Failed to add recurrence');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Recurrence
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event Recurrence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitRecurrence)} className="space-y-4">
          <select {...register('frequency')} className="w-full p-2 border rounded">
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
          <Input type="number" placeholder="Interval" {...register('interval', { valueAsNumber: true })} />
          {errors.interval && <p className="text-red-500 text-sm">{errors.interval.message}</p>}
          <Input type="datetime-local" placeholder="End Date" {...register('endDate')} />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          <Input type="number" placeholder="Count" {...register('count', { valueAsNumber: true })} />
          {errors.count && <p className="text-red-500 text-sm">{errors.count.message}</p>}
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}