import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a, b) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function Calendar({ selected, onSelect }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : today.getMonth())
  const [monthOpen, setMonthOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const daysInPrev = getDaysInMonth(viewYear, viewMonth - 1)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // Build 6 rows × 7 cols
  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrev - firstDay + 1 + i, outside: true, date: new Date(viewYear, viewMonth - 1, daysInPrev - firstDay + 1 + i) })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, outside: false, date: new Date(viewYear, viewMonth, i) })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, outside: true, date: new Date(viewYear, viewMonth + 1, next - 1) })
  }

  const years = Array.from({ length: 10 }, (_, i) => today.getFullYear() - 2 + i)

  return (
    <div className="bg-background border border-border rounded-[10px] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] flex flex-col gap-4 p-3 w-[240px]">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>

        <div className="flex items-center gap-1.5">
          {/* Month dropdown */}
          <div className="relative">
            <button
              onClick={() => { setMonthOpen(o => !o); setYearOpen(false) }}
              className="flex items-center gap-1 h-8 pl-2 pr-1 border border-border rounded-md shadow-[0px_1px_1px_rgba(0,0,0,0.1)] text-[14px] font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {MONTHS_SHORT[viewMonth]}
              <ChevronDown className="w-3 h-3 text-foreground" />
            </button>
            {monthOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-background border border-border rounded-lg shadow-md py-1 min-w-[110px] max-h-[200px] overflow-y-auto">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => { setViewMonth(i); setMonthOpen(false) }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted transition-colors ${i === viewMonth ? 'font-semibold' : ''}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year dropdown */}
          <div className="relative">
            <button
              onClick={() => { setYearOpen(o => !o); setMonthOpen(false) }}
              className="flex items-center gap-1 h-8 pl-2 pr-1 border border-border rounded-md shadow-[0px_1px_1px_rgba(0,0,0,0.1)] text-[14px] font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {viewYear}
              <ChevronDown className="w-3 h-3 text-foreground" />
            </button>
            {yearOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-background border border-border rounded-lg shadow-md py-1 min-w-[70px] max-h-[200px] overflow-y-auto">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => { setViewYear(y); setYearOpen(false) }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-muted transition-colors ${y === viewYear ? 'font-semibold' : ''}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-0">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="h-[21px] flex items-center justify-center">
              <span className="text-[12px] text-muted-foreground">{d}</span>
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, i) => {
            const isSelected = isSameDay(cell.date, selected)
            return (
              <button
                key={i}
                onClick={() => onSelect?.(cell.date)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-[14px] transition-colors
                  ${isSelected ? 'bg-foreground text-background' : 'hover:bg-muted'}
                  ${cell.outside && !isSelected ? 'opacity-50' : ''}
                  ${isSameDay(cell.date, today) && !isSelected ? 'font-semibold' : ''}
                `}
              >
                {cell.day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
