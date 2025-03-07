
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isWeekend } from 'date-fns';
import { Clock, X, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';

// Indian market holidays in 2024
const INDIAN_MARKET_HOLIDAYS_2024 = [
  new Date(2024, 0, 26),  // Republic Day
  new Date(2024, 2, 8),   // Holi
  new Date(2024, 2, 29),  // Good Friday
  new Date(2024, 3, 11),  // Eid-ul-Fitr
  new Date(2024, 3, 17),  // Ram Navami
  new Date(2024, 4, 1),   // Maharashtra Day
  new Date(2024, 4, 20),  // Lok Sabha Elections
  new Date(2024, 5, 17),  // Bakri Eid
  new Date(2024, 6, 17),  // Muharram
  new Date(2024, 7, 15),  // Independence Day
  new Date(2024, 7, 26),  // Ganesh Chaturthi
  new Date(2024, 9, 2),   // Gandhi Jayanti
  new Date(2024, 9, 31),  // Diwali-Laxmi Puja
  new Date(2024, 10, 15), // Guru Nanak Jayanti
  new Date(2024, 11, 25)  // Christmas
];

// Holiday descriptions
const HOLIDAY_DESCRIPTIONS: Record<string, string> = {
  '2024-01-26': 'Republic Day',
  '2024-03-08': 'Holi',
  '2024-03-29': 'Good Friday',
  '2024-04-11': 'Eid-ul-Fitr',
  '2024-04-17': 'Ram Navami',
  '2024-05-01': 'Maharashtra Day',
  '2024-05-20': 'Lok Sabha Elections',
  '2024-06-17': 'Bakri Eid',
  '2024-07-17': 'Muharram',
  '2024-08-15': 'Independence Day',
  '2024-08-26': 'Ganesh Chaturthi',
  '2024-10-02': 'Gandhi Jayanti',
  '2024-10-31': 'Diwali-Laxmi Puja',
  '2024-11-15': 'Guru Nanak Jayanti',
  '2024-12-25': 'Christmas'
};

interface MarketCalendarProps {
  onClose: () => void;
}

const MarketCalendar = ({ onClose }: MarketCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'hours' | 'holidays'>('calendar');
  
  // Format selected date for display
  const formattedDate = selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
  
  // Check if selected date is a holiday
  const isHoliday = selectedDate ? 
    INDIAN_MARKET_HOLIDAYS_2024.some(holiday => 
      holiday.getDate() === selectedDate.getDate() && 
      holiday.getMonth() === selectedDate.getMonth()) : 
    false;
  
  // Get holiday name if it's a holiday
  const holidayName = selectedDate ? 
    HOLIDAY_DESCRIPTIONS[format(selectedDate, 'yyyy-MM-dd')] : '';
  
  // Is weekend
  const isWeekendDay = selectedDate ? isWeekend(selectedDate) : false;
  
  // Is market closed on selected date
  const isMarketClosed = isHoliday || isWeekendDay;

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader className="relative pb-2">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Indian Stock Market Calendar
        </CardTitle>
        <CardDescription>
          NSE & BSE trading days and hours
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="calendar" className="w-full" onValueChange={(value) => setView(value as any)}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="hours">Trading Hours</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="calendar" className="mt-0">
          <CardContent className="pt-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded border p-3 pointer-events-auto"
              modifiers={{
                holiday: INDIAN_MARKET_HOLIDAYS_2024,
                weekend: (date: Date) => isWeekend(date),
              }}
              modifiersClassNames={{
                holiday: "bg-red-100 text-red-900 font-medium",
                weekend: "bg-gray-100 text-gray-500",
              }}
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 rounded-lg border bg-gray-50">
                <h3 className="font-medium">{formattedDate}</h3>
                
                {isMarketClosed ? (
                  <div className="mt-2 flex items-center text-red-600 gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Market Closed</span>
                    {isHoliday && <span>- {holidayName}</span>}
                    {isWeekendDay && <span>- Weekend</span>}
                  </div>
                ) : (
                  <div className="mt-2 flex items-center text-green-600 gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Market Open (09:15 - 15:30)</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="hours" className="mt-0">
          <CardContent className="pt-4 space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Regular Trading Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pre-market Session:</span>
                  <span className="font-medium">09:00 - 09:15 IST</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Normal Market:</span>
                  <span className="font-medium">09:15 - 15:30 IST</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Post-market Session:</span>
                  <span className="font-medium">15:40 - 16:00 IST</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Trading Days</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-green-600">Open</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday & Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">National Holidays</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="holidays" className="mt-0">
          <CardContent className="pt-4">
            <div className="rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holiday</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {INDIAN_MARKET_HOLIDAYS_2024.map((holiday, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                        {format(holiday, 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {HOLIDAY_DESCRIPTIONS[format(holiday, 'yyyy-MM-dd')]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="text-xs text-gray-500 pt-0">
        Note: Market holidays are subject to change by exchange notifications.
      </CardFooter>
    </Card>
  );
};

export default MarketCalendar;
