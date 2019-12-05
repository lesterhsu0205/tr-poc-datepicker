import CalenderDate from './calenderDate'

export default class DayUtil {
  static isToday(y, m, d, today) {
    const todayY = today.getFullYear()
    const todayM = today.getMonth() + 1
    const todayD = today.getDate()
    return Object.is(y, todayY) && Object.is(m, todayM) && Object.is(d, todayD)
  }

  static isActiveDate(y, m, d, selectedDate) {
    return (
      Object.is(selectedDate.year, y) &&
      Object.is(selectedDate.month, m) &&
      Object.is(selectedDate.day, d)
    )
  }
}
