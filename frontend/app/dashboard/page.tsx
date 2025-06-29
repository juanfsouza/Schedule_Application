'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainContent from '@/app/components/MainContent';
import { toast } from 'sonner';
import Sidebar from '@/app/components/Sidebar';

function jwtDecode<T>(token: string): T {
  const payload = token.split('.')[1];
  if (!payload) throw new Error('Invalid token');
  const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  return decoded as T;
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date('2025-06-29T05:26:00-03:00'));
  const [calendars, setCalendars] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in');
        router.push('/login');
        return;
      }
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        const userId = decoded.id;
        const [calendarsRes, eventsRes, userRes] = await Promise.all([
          fetch(`${baseUrl}/calendars`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/users?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!calendarsRes.ok) throw new Error(await calendarsRes.text() || 'Failed to fetch calendars');
        if (!eventsRes.ok) throw new Error(await eventsRes.text() || 'Failed to fetch events');
        if (!userRes.ok) throw new Error(await userRes.text() || 'Failed to fetch user');

        const calendarsData = (await calendarsRes.json()).data;
        setCalendars(calendarsData);
        setEvents((await eventsRes.json()).data);
        const userData = (await userRes.json()).data[0];
        setUser(userData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fetch error:', error);
          toast.error(error.message || 'Failed to load data');
          if (error.message.includes('Invalid token')) {
            localStorage.removeItem('token');
            router.push('/login');
          }
        } else {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred');
        }
      }
    };
    fetchData();
  }, [router]);

  const handlePrevMonth = () => {
    setDate((prev) => prev && new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => prev && new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getEventById = async (id: string) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const res = await fetch(`${baseUrl}/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
      <Sidebar date={date} onDateSelect={setDate} events={events} />
      <MainContent
        date={date}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        user={user}
        calendars={calendars}
        events={events}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        onResetEvent={() => {}}
        getEventById={getEventById}
      />
    </div>
  );
}