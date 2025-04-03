import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths 
} from 'date-fns';
import { CalendarEvent } from '../../types';

interface CalendarTabProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onSelectEventDate: (date: Date) => void;
  onDeleteEvent: (id: string) => void;
}

const CalendarTab: React.FC<CalendarTabProps> = ({
  events,
  onAddEvent,
  onSelectEventDate,
  onDeleteEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <CalendarIcon size={24} className="mr-2 text-blue-600" />
              Learning Calendar
            </h1>
            <p className="text-gray-500 mt-1">
              {format(currentDate, 'MMMM yyyy')}
            </p>
          </div>
          <button 
            onClick={onAddEvent}
            className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={18} className="mr-2" /> 
            Create New Event
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div 
                key={day} 
                className="p-3 bg-white text-sm font-medium text-gray-500 text-center uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
            
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50 min-h-[100px]" />
            ))}

            {daysInMonth.map((date, i) => {
              const dayEvents = events.filter(event => 
                isSameDay(new Date(event.date), date)
              );
              const isToday = isSameDay(date, new Date());

              return (
                <div 
                  key={i}
                  className={`relative min-h-[120px] p-2 border-b border-r border-gray-100 hover:bg-blue-50 transition-colors ${
                    !isSameMonth(date, currentDate) ? 'bg-gray-50' : 'bg-white'
                  }`}
                  onClick={() => onSelectEventDate(date)}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isToday 
                        ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                        : 'text-gray-700'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex space-x-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id}
                            className="w-2 h-2 rounded-full bg-blue-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {dayEvents.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Events
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No upcoming events scheduled
              </div>
            ) : (
              events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                <div 
                  key={event.id} 
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <p className="font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {format(new Date(event.date), 'EEEE, MMM d • h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete event"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
