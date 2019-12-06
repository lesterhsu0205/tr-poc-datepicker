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

  static fillMonths(selectDate) {
    let container = [[], [], []]
    for (let i = 0, month = 1; i < 3 || month < this.months.length + 1; i++) {
      for (let j = 0; j < 4; j++, month++) {
        container[i][j] = new CalenderDate(
          selectDate.year,
          month,
          this.month2Src(month),
          selectDate.day,
          'black',
          Object.is(month, selectDate.month)
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
