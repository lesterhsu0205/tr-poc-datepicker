<template>
  <div>
    {{ `${select.year}-${select.month}-${select.day}` }}
    <div class="date-picker">
      <div class="calender">
        <table>
          <thead>
            <tr>
              <td @click="togglePage('left')">
                <i class="fas fa-angle-left"></i>
              </td>
              <td colspan="5" @click="toggleTitle">
                <span class="calendarTitle"> {{ calendarTitle }} </span>
              </td>
              <td @click="togglePage('right')">
                <i class="fas fa-angle-right"></i>
              </td>
            </tr>
            <tr v-if="Object.is(pageMode, 'day')">
              <td>Su</td>
              <td>Mo</td>
              <td>Tu</td>
              <td>We</td>
              <td>Th</td>
              <td>Fr</td>
              <td>Sa</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rowData, i) in container" :key="i">
              <td
                v-for="(calendarDate, j) in rowData"
                :key="j"
                :class="calendarDate.isActive ? 'focus' : ''"
                @click="toggle(calendarDate)"
              >
                <span
                  class="day"
                  :style="'display:block; color:' + calendarDate.color"
                  ><div v-if="Object.is(pageMode, 'day')">
                    {{ calendarDate.day }}
                  </div>
                  <div v-else-if="Object.is(pageMode, 'month')">
                    {{ calendarDate.month }}
                  </div>
                  <div v-else-if="Object.is(pageMode, 'year')">
                    {{ calendarDate.year }}
                  </div></span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import './../assets/css/datepicker.css'
import MonthUtil from './../assets/js/monthUtil'
import DayUtil from './../assets/js/dayUtil'
import CalenderDate from './../assets/js/calenderDate'

export default {
  props: {
    message: {
      type: String,
      default: null
    }
  },
  data: function() {
    return {
      calendarTitle: null,
      today: null,
      pageMode: null,
      modes: ['day', 'month', 'year'],
      select: {},
      container: null
    }
  },
  watch: {
    message: function(val) {
      if (val && val.length > 0) {
        this.alertMessage()
      }
    }
  },
  mounted: function() {
    this.today = new Date()
    this.pageMode = this.modes[0]

    this.refreshSelectDate(this.today)

    this.calendarTitle = `${MonthUtil.month2Src(this.select.month)} ${
      this.select.year
    }`

    this.fillDays()
  },
  methods: {
    togglePage(direction) {
      const currParsedTitle = this.parseCalendarTitle()
      const lastYearMonth = this.getRelativeYearMonth(
        currParsedTitle.year,
        currParsedTitle.month,
        Object.is('left', direction) ? -1 : 1
      )
      const monthSrc = MonthUtil.month2Src(lastYearMonth.month)
      this.calendarTitle = `${monthSrc} ${lastYearMonth.year}`
      this.fillDays()
    },
    toggleTitle() {
      // if (Object.is(this.pageMode, 'days')) {
      // }
      this.pageMode = 'month'
      this.calendarTitle = this.parseCalendarTitle().year
      // this.fillMonths()
      this.container = MonthUtil.fillMonths(this.select)
    },
    refreshSelectDate(date) {
      this.select = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        dayOfTheWeek: date.getDay() // Sunday - Saturday : 0 - 6
      }
    },
    toggle(calendarDate) {
      // const toggleVal = event.target.textContent
      // event.target.parentNode.classList.toggle('focus')

      for (let i = 0; i < this.container.length; i++) {
        for (let j = 0; j < this.container[i].length; j++) {
          this.container[i][j].isActive = false
        }
      }

      calendarDate.isActive = true

      // fetch array in vue
      this.container[0].splice(0, 0)

      const toogleDate = new Date(
        calendarDate.year,
        calendarDate.month - 1,
        calendarDate.day
      )

      this.refreshSelectDate(toogleDate)
    },
    fillDays() {
      const parsedCalendar = this.parseCalendarTitle()
      const year = parsedCalendar.year
      const month = parsedCalendar.month
      const indexOfWeek = new Date(year, month - 1, 1).getDay()
      const daysInMonth = MonthUtil.getEndDayInMonth(year, month)
      const lastYearMonth = this.getRelativeYearMonth(year, month, -1)
      const nextYearMonth = this.getRelativeYearMonth(year, month, +1)
      const daysInLastMonth = MonthUtil.getEndDayInMonth(
        lastYearMonth.year,
        lastYearMonth.month
      )

      this.container = [[], [], [], [], [], []]

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
              this.container[i][j] = new CalenderDate(
                lastYearMonth.year,
                lastYearMonth.month,
                lastDay,
                'gray',
                DayUtil.isActiveDate(
                  lastYearMonth.year,
                  lastYearMonth.month,
                  lastDay,
                  this.select
                )
              )
            } else {
              this.container[i][j] = new CalenderDate(
                year,
                month,
                thisDay,
                DayUtil.isToday(year, month, thisDay, this.today)
                  ? '#db3d44'
                  : 'black',
                DayUtil.isActiveDate(year, month, thisDay, this.select)
              )
              thisDay++
            }
          }
        } else {
          for (let j = 0; j < 7; j++, thisDay++) {
            // 補下個月
            if (thisDay > daysInMonth) {
              this.container[i][j] = new CalenderDate(
                nextYearMonth.year,
                nextYearMonth.month,
                nextDay,
                'gray',
                DayUtil.isActiveDate(
                  nextYearMonth.year,
                  nextYearMonth.month,
                  nextDay,
                  this.select
                )
              )
              nextDay++
            } else {
              this.container[i][j] = this.container[i][j] = new CalenderDate(
                year,
                month,
                thisDay,
                DayUtil.isToday(year, month, thisDay, this.today)
                  ? '#db3d44'
                  : 'black',
                DayUtil.isActiveDate(year, month, thisDay, this.select)
              )
            }
          }
        }
      }
    },
    parseCalendarTitle() {
      const titleDateArray = this.calendarTitle.split(' ')
      const year = titleDateArray[1]
      const monthSrc = titleDateArray[0]
      return {
        year: parseInt(year),
        month: MonthUtil.src2Month(monthSrc)
      }
    },
    getRelativeYearMonth(year, month, index) {
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
}
</script>
