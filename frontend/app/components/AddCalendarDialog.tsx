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
import useCalendarStore, { Calendar } from '@/app/store/calendarStore';

const createCalendarSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string(),
  isDefault: z.boolean(),
  isVisible: z.boolean(),
});

type CalendarFormData = z.infer<typeof createCalendarSchema>;

type AddCalendarDialogProps = {
  calendars: Calendar[];
};

export default function AddCalendarDialog({ calendars }: AddCalendarDialogProps) {
  const { createCalendarAPI } = useCalendarStore();
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
    try {
      await createCalendarAPI(data);
      reset();
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Name</label>
            <Input
              {...register('name')}
              placeholder="Calendar Name"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input
              {...register('description')}
              placeholder="Description"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <Input
              {...register('color')}
              type="color"
              className="w-full border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              {...register('isDefault')}
              type="checkbox"
              className="h-4 w-4 text-zinc-600 border-gray-300 rounded focus:ring-zinc-500"
            />
            <label className="text-sm font-medium text-gray-700">Default Calendar</label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              {...register('isVisible')}
              type="checkbox"
              className="h-4 w-4 text-zinc-600 border-gray-300 rounded focus:ring-zinc-500"
            />
            <label className="text-sm font-medium text-gray-700">Visible</label>
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}