'use client';

import { Button } from '@/app/components/ui/button';
import { 
  CalendarIcon, 
  Plus, 
  LayoutDashboard,
  Store,
  Users,
  Palette,
  Mail,
  Clock,
  Bell,
  User,
  ShoppingCart,
  UserCheck,
  Settings,
  HelpCircle,
  FileText,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CalendarComponent from './CalendarComponent';
import { useState } from 'react';

type SidebarProps = {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  events: any[];
};

export default function Sidebar({ date, onDateSelect, events }: SidebarProps) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('Scheduling');
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Store, label: 'Store', href: '/store' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: Palette, label: 'Customize', href: '/customize' },
    { icon: Mail, label: 'Email', href: '/email' },
    { icon: Clock, label: 'Scheduling', href: '/scheduling', active: true },
    { icon: Bell, label: 'Notifications', href: '/notifications', badge: '4' },
  ];

  const storeItems = [
    { icon: Store, label: 'My store', href: '/my-store' },
    { icon: User, label: 'My account', href: '/my-account' },
    { icon: ShoppingCart, label: 'My orders', href: '/my-orders' },
    { icon: UserCheck, label: 'My affiliates', href: '/my-affiliates' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Support', href: '/support' },
    { icon: FileText, label: 'Documentation', href: '/documentation' },
    { icon: ExternalLink, label: 'Open in browser', href: '/browser' },
  ];

  const handleItemClick = (item: string, href: string) => {
    setActiveItem(item);
    router.push(href);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <div className="w-64 bg-zinc-800 text-white h-screen flex flex-col min-h-screen border-r border-zinc-700">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-zinc-800 text-xs font-bold">!</span>
            </div>
            <h2 className="text-lg font-semibold">Makes Agents UI</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-700">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto bg-zinc-800">
        <nav className="p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleItemClick(item.label, item.href)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeItem === item.label
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Store Section */}
        <div className="p-2 mt-4">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              STORE.AMELIELAURENT.CO
            </span>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-700">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1 mt-2">
            {storeItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleItemClick(item.label, item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeItem === item.label
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendar Section - Only show when Scheduling is active */}
        {activeItem === 'Scheduling' && (
          <div className="p-2 mt-4">
            <div className="bg-zinc-700 rounded-lg p-3">
              {/* Calendar Header with Dropdown */}
              <button
                onClick={toggleCalendar}
                className="w-full flex items-center justify-between mb-3 hover:bg-zinc-600 rounded p-1 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-medium">My Calendar</h3>
                </div>
                {isCalendarOpen ? (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                )}
              </button>

              {/* Calendar Content - Only show when open */}
              {isCalendarOpen && (
                <>
                  <div className="mb-3 max-h-[200px] overflow-auto">
                    <CalendarComponent date={date} onSelect={onDateSelect} events={events} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      My Schedules
                    </h4>
                    <div className="space-y-1">
                      {['Daily Standup', 'Weekly Review', 'Team Meeting', 'Client Meeting'].map((schedule) => (
                        <button
                          key={schedule}
                          className="w-full text-left px-2 py-1 text-xs text-zinc-300 hover:text-white hover:bg-zinc-600 rounded transition-colors"
                        >
                          {schedule}
                        </button>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 border-zinc-600 text-zinc-300 hover:bg-zinc-600 hover:text-white hover:border-zinc-500 bg-transparent"
                      >
                        <Plus className="mr-1 h-3 w-3" /> Add Schedule
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="p-2 border-t border-zinc-700 bg-zinc-800 flex-shrink-0">
        <ul className="space-y-1">
          {bottomItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleItemClick(item.label, item.href)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeItem === item.label
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.label === 'Open in browser' && (
                  <ExternalLink className="h-3 w-3 ml-auto" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}