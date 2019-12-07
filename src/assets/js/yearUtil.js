import MonthUtil from './monthUtil'
import CalendarDate from './calenderDate'

export default class YearUtil {
  static fillYears(yearBound, selectDate, today) {
    let container = [[], [], []]

    for (
      let i = 0, year = yearBound.lower;
      i < 3 || year < yearBound.upper + 1;
      i++
    ) {
      for (let j = 0; j < 4; j++, year++) {
        container[i][j] = new CalendarDate(
          year,
          1,
          MonthUtil.month2Src(1),
          1,
          this.isTodayYear(yearBound, today, year),
          Object.is(year, selectDate.year)
        )
      }
    }

    return container
  }

  static getYearBound(year) {
    const remainder = year % 10
    return {
      upper: 10 - remainder + year,
      lower: -1 - remainder + year
    }
  }

  static isTodayYear(yearBound, today, compareYear) {
    return Object.is(compareYear, today.getFullYear())
      ? '#db3d44'
      : Object.is(compareYear, yearBound.lower) ||
        Object.is(compareYear, yearBound.upper)
      ? 'gray'
      : 'black'
  }
}
