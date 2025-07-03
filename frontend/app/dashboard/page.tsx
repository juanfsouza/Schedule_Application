'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainContent from '@/app/components/MainContent';
import { toast, Toaster } from 'sonner';
import Sidebar from '@/app/components/Sidebar';
import useCalendarStore, { Event, Calendar } from '@/app/store/calendarStore';

function jwtDecode<T>(token: string): T {
  const payload = token.split('.')[1];
  if (!payload) throw new Error('Invalid token');
  const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  return decoded as T;
}

interface User {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date('2025-06-29T05:26:00-03:00'));
  const [user, setUser] = useState<User | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const router = useRouter();
  const { calendars, events, fetchCalendars, fetchEvents } = useCalendarStore();

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        toast.error('Please log in');
        router.push('/auth/login');
        return;
      }
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        const userId = decoded.id;
        const userRes = await fetch(`${baseUrl}/users?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error(await userRes.text() || 'Failed to fetch user');

        const userData = (await userRes.json()).data[0];
        setUser(userData);

        await Promise.all([fetchCalendars(), fetchEvents()]);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetch error:', error);
          toast.error(error.message || 'Failed to load data');
          if (error.message.includes('Invalid token')) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            router.push('/auth/login');
          }
        } else {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred');
        }
      }
    };
    fetchData();
  }, [router, fetchCalendars, fetchEvents]);

  const handlePrevMonth = () => {
    setDate((prev) => prev && new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => prev && new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getEventById = async (id: string): Promise<Event | null> => {
    const token = getToken();
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      router.push('/auth/login');
      return null;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const res = await fetch(`${baseUrl}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return (await res.json()).data;
      toast.error('Failed to fetch event');
      return null;
    } catch (error) {
      console.error('Get event error:', error);
      toast.error('Failed to fetch event');
      return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster richColors position="top-right" />
      <Sidebar date={date} onDateSelect={setDate} events={events} />
      <MainContent
        date={date}
        setDate={setDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        user={user}
        calendars={calendars}
        events={events}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        onResetEvent={() => setSelectedEventId(null)}
        getEventById={getEventById}
      />
    </div>
  );
}