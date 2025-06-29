'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const workingHoursSchema = z.object({
  mondayStart: z.number().min(0).max(1440),
  mondayEnd: z.number().min(0).max(1440),
});

type WorkingHoursFormData = z.infer<typeof workingHoursSchema>;

export default function SetWorkingHoursDialog() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkingHoursFormData>({
    resolver: zodResolver(workingHoursSchema),
    defaultValues: {
      mondayStart: 0,
      mondayEnd: 1440,
    },
  });

  const onSubmitWorkingHours = async (data: WorkingHoursFormData) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const res = await fetch(`${baseUrl}/working-hours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Working hours set');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to set working hours');
      }
    } catch (error) {
      console.error('Working hours error:', error);
      toast.error('Failed to set working hours');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Set Working Hours
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Working Hours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitWorkingHours)} className="space-y-4">
          <Input type="number" placeholder="Monday Start (minutes)" {...register('mondayStart', { valueAsNumber: true })} />
          {errors.mondayStart && <p className="text-red-500 text-sm">{errors.mondayStart.message}</p>}
          <Input type="number" placeholder="Monday End (minutes)" {...register('mondayEnd', { valueAsNumber: true })} />
          {errors.mondayEnd && <p className="text-red-500 text-sm">{errors.mondayEnd.message}</p>}
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}