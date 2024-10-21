import { format } from 'date-fns'

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export function getToday() {
  const date = new Date()
  return format(date, 'yyyy-MM-dd')
}

export function getNextDay() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return format(date, 'yyyy-MM-dd')
}
