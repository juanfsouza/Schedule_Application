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

const createCalendarSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string(),
  isDefault: z.boolean(),
  isVisible: z.boolean(),
});

type CalendarFormData = z.infer<typeof createCalendarSchema>;

type AddCalendarDialogProps = {
  calendars: any[];
  onSubmit: (data: CalendarFormData) => Promise<void>;
};

export default function AddCalendarDialog({ calendars }: AddCalendarDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CalendarFormData>({
    resolver: zodResolver(createCalendarSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#3b82f6',
      isDefault: false,
      isVisible: true,
    },
  });

  const onSubmitCalendar = async (data: CalendarFormData) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const res = await fetch(`${baseUrl}/calendars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success('Calendar created');
        reset();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to create calendar');
      }
    } catch (error) {
      console.error('Calendar creation error:', error);
      toast.error('Failed to create calendar');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ShinyButton>
          <div className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Calendar
          </div>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Calendar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitCalendar)} className="space-y-4">
          <Input {...register('name')} placeholder="Calendar Name" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          <Input {...register('description')} placeholder="Description" />
          <Input {...register('color')} type="color" />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}