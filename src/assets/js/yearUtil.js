import MonthUtil from './monthUtil'
import CalendarDate from './calenderDate'

export default class YearUtil {
  static fillYears(yearBound, selectDate) {
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
          Object.is(year, yearBound.lower) || Object.is(year, yearBound.upper)
            ? 'gray'
            : 'black',
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
}
