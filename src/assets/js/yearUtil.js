import CalendarDate from './calenderDate'

export default class YearUtil {
  static fillYears(selectDate) {
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
}
