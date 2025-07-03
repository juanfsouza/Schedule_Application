import { create } from 'zustand';
import { toast } from 'sonner';

export type Event = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  color?: string;
  calendarId: string;
  location?: string;
  type?: 'APPOINTMENT' | 'MEETING' | 'BIRTHDAY' | 'REMINDER' | 'TASK' | 'OTHER';
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  isRecurring?: boolean;
};

export type Calendar = {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
};

type CalendarStore = {
  events: Event[];
  calendars: Calendar[];
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  fetchCalendars: () => Promise<void>;
  createEventAPI: (eventData: Omit<Event, 'id'>) => Promise<void>;
  updateEventAPI: (eventId: string, eventData: Partial<Event>) => Promise<void>;
  deleteEventAPI: (eventId: string) => Promise<void>;
};

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  calendars: [],
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    const token = getToken();
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      set({ isLoading: false });
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const response = await fetch(`${baseUrl}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ events: data.data });
      } else if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        toast.error('Sessão expirada. Faça login novamente.');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Fetch events error:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCalendars: async () => {
    set({ isLoading: true });
    const token = getToken();
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      set({ isLoading: false });
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const response = await fetch(`${baseUrl}/calendars`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ calendars: data.data });
      } else if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        toast.error('Sessão expirada. Faça login novamente.');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      } else {
        throw new Error('Failed to fetch calendars');
      }
    } catch (error) {
      console.error('Fetch calendars error:', error);
      toast.error('Erro ao carregar calendários');
    } finally {
      set({ isLoading: false });
    }
  },

  createEventAPI: async (eventData: Omit<Event, 'id'>) => {
    const token = getToken();
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const response = await fetch(`${baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        const data = await response.json();
        set((state) => ({
          events: [...state.events, { ...eventData, id: data.data.id }],
        }));
        toast.success('Evento criado com sucesso');
      } else if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        toast.error('Sessão expirada. Faça login novamente.');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      toast.error('Erro ao criar evento');
    }
  },

  updateEventAPI: async (eventId: string, eventData: Partial<Event>) => {
    const token = getToken();
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const response = await fetch(`${baseUrl}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId ? { ...event, ...eventData } : event
          ),
        }));
        toast.success('Evento atualizado com sucesso');
      } else if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        toast.error('Sessão expirada. Faça login novamente.');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Update event error:', error);
      toast.error('Erro ao atualizar evento');
    }
  },

  deleteEventAPI: async (eventId: string) => {
    const token = getToken();
    if (!token) {
      toast.error('Token de autenticação não encontrado');
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
      const response = await fetch(`${baseUrl}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
        }));
        toast.success('Evento excluído com sucesso');
      } else if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        toast.error('Sessão expirada. Faça login novamente.');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Erro ao excluir evento');
    }
  },
}));

export default useCalendarStore;