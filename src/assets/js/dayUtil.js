import CalenderDate from './calenderDate'
import MonthUtil from './monthUtil'

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

  static fillDays(
    parsedCalendar,
    indexOfWeek,
    daysInMonth,
    lastYearMonth,
    nextYearMonth,
    today,
    selectedDate
  ) {
    const year = parsedCalendar.year
    const month = parsedCalendar.month
    const monthSrc = parsedCalendar.monthSrc

    const daysInLastMonth = MonthUtil.getEndDayInMonth(
      lastYearMonth.year,
      lastYearMonth.month
    )

    let container = [[], [], [], [], [], []]

    for (
      let i = 0, thisDay = 1, nextDay = 1;
      thisDay < daysInMonth + 1 || i < 6;
      i++
    ) {
      if (Object.is(i, 0)) {
        // 第一個禮拜
        for (let j = 0; j < 7; j++) {
          //如果該月份不是從禮拜日開始填，則填上一個月的尾
          if (j < indexOfWeek) {
            let lastDay = daysInLastMonth - indexOfWeek + j + 1
            container[i][j] = new CalenderDate(
              lastYearMonth.year,
              lastYearMonth.month,
              MonthUtil.month2Src(lastYearMonth.month),
              lastDay,
              'gray',
              this.isActiveDate(
                lastYearMonth.year,
                lastYearMonth.month,
                lastDay,
                selectedDate
              )
            )
          } else {
            container[i][j] = new CalenderDate(
              year,
              month,
              monthSrc,
              thisDay,
              this.isToday(year, month, thisDay, today) ? '#db3d44' : 'black',
              this.isActiveDate(year, month, thisDay, selectedDate)
            )
            thisDay++
          }
        }
      } else {
        for (let j = 0; j < 7; j++, thisDay++) {
          // 補下個月
          if (thisDay > daysInMonth) {
            container[i][j] = new CalenderDate(
              nextYearMonth.year,
              nextYearMonth.month,
              MonthUtil.month2Src(nextYearMonth.month),
              nextDay,
              'gray',
              this.isActiveDate(
                nextYearMonth.year,
                nextYearMonth.month,
                nextDay,
                selectedDate
              )
            )
            nextDay++
          } else {
            container[i][j] = container[i][j] = new CalenderDate(
              year,
              month,
              monthSrc,
              thisDay,
              this.isToday(year, month, thisDay, today) ? '#db3d44' : 'black',
              this.isActiveDate(year, month, thisDay, selectedDate)
            )
          }
        }
      }
    }

    return container
  }

  static parseCalendarTitle(calendarTitle) {
    const titleDateArray = calendarTitle.split(' ')
    const year = titleDateArray[1]
    const monthSrc = titleDateArray[0]
    return {
      year: parseInt(year),
      month: MonthUtil.src2Month(monthSrc),
      monthSrc: monthSrc
    }
  }

  static getRelativeYearMonth(year, month, index) {
    if (index) {
      month = month + index
    }
    const date = new Date(year, month - 1)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1
    }
  }
}
