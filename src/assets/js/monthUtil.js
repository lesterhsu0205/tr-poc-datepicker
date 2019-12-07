import CalenderDate from './calenderDate'

export default class MonthUtil {
  static months = [
    { Jan: 31 },
    { Feb: 28 },
    { Mar: 31 },
    { Apr: 30 },
    { May: 31 },
    { Jun: 30 },
    { Jul: 31 },
    { Aug: 31 },
    { Sep: 30 },
    { Oct: 31 },
    { Nov: 30 },
    { Dec: 31 }
  ]

  static fillMonths(refDate, selectedDate) {
    let container = [[], [], []]
    for (let i = 0, month = 1; i < 3 || month < this.months.length + 1; i++) {
      for (let j = 0; j < 4; j++, month++) {
        container[i][j] = new CalenderDate(
          refDate.year,
          month,
          this.month2Src(month),
          1,
          'black',
          Object.is(month, selectedDate.month) &&
            Object.is(refDate.year, selectedDate.year)
        )
      }
    }
    return container
  }

  static month2Src(month) {
    return Object.keys(this.months[month - 1])[0]
  }

  static src2Month(monthSrc) {
    for (let i = 0; i < this.months.length; i++) {
      if (Object.is(Object.keys(this.months[i])[0], monthSrc)) {
        return i + 1
      }
    }
  }

  static getEndDayInMonth(year, month) {
    return Object.is(year % 4, 0) && Object.is(month, 2)
      ? Object.values(this.months[month - 1])[0] + 1
      : Object.values(this.months[month - 1])[0]
  }
}
