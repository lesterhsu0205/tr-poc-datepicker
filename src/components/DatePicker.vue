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
      container: null,
      months: [
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

    this.calendarTitle = `${this.month2Src(this.select.month)} ${
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
      const monthSrc = this.month2Src(lastYearMonth.month)
      this.calendarTitle = `${monthSrc} ${lastYearMonth.year}`
      this.fillDays()
    },
    toggleTitle() {
      this.pageMode = 'month'
      this.calendarTitle = this.parseCalendarTitle().year
      this.fillMonths()
    },
    isToday(y, m, d) {
      const todayY = this.today.getFullYear()
      const todayM = this.today.getMonth() + 1
      const todayD = this.today.getDate()
      return (
        Object.is(y, todayY) && Object.is(m, todayM) && Object.is(d, todayD)
      )
    },
    isActiveDate(y, m, d) {
      return (
        Object.is(this.select.year, y) &&
        Object.is(this.select.month, m) &&
        Object.is(this.select.day, d)
      )
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
    fillMonths() {
      this.container = [[], [], []]
      for (let i = 0, month = 1; i < 3 || month < this.months.length + 1; i++) {
        for (let j = 0; j < 4; j++, month++) {
          this.container[i][j] = new CalenderDate(
            this.select.year,
            this.month2Src(month),
            this.select.day,
            'black',
            Object.is(month, this.select.month)
          )
        }
      }
    },
    fillDays() {
      const parsedCalendar = this.parseCalendarTitle()
      const year = parsedCalendar.year
      const month = parsedCalendar.month
      const indexOfWeek = new Date(year, month - 1, 1).getDay()
      const daysInMonth = this.getEndDayInMonth(year, month)
      const lastYearMonth = this.getRelativeYearMonth(year, month, -1)
      const nextYearMonth = this.getRelativeYearMonth(year, month, +1)
      const daysInLastMonth = this.getEndDayInMonth(
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
                this.isActiveDate(
                  lastYearMonth.year,
                  lastYearMonth.month,
                  lastDay
                )
              )
            } else {
              this.container[i][j] = new CalenderDate(
                year,
                month,
                thisDay,
                this.isToday(year, month, thisDay) ? '#db3d44' : 'black',
                this.isActiveDate(year, month, thisDay)
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
                this.isActiveDate(
                  nextYearMonth.year,
                  nextYearMonth.month,
                  nextDay
                )
              )
              nextDay++
            } else {
              this.container[i][j] = this.container[i][j] = new CalenderDate(
                year,
                month,
                thisDay,
                this.isToday(year, month, thisDay) ? '#db3d44' : 'black',
                this.isActiveDate(year, month, thisDay)
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
        month: this.src2Month(monthSrc)
      }
    },
    src2Month(monthSrc) {
      for (let i = 0; i < this.months.length; i++) {
        if (Object.is(Object.keys(this.months[i])[0], monthSrc)) {
          return i + 1
        }
      }
    },
    month2Src(month) {
      return Object.keys(this.months[month - 1])[0]
    },
    getEndDayInMonth(year, month) {
      return Object.is(year % 4, 0) && Object.is(month, 2)
        ? Object.values(this.months[month - 1])[0] + 1
        : Object.values(this.months[month - 1])[0]
    },
    getRelativeYearMonth(year, month, index) {
      if (index) {
        month = month + index
      }
      const date = new Date(year, month - 1)

      // if (Object.is(1, month)) {
      //   year = year - 1
      //   month = 12
      // } else if () {

      // }

      // else {
      //   month = month - 1
      // }

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    }
  }
}

class CalenderDate {
  constructor(y, m, d, color, isActive) {
    this.year = y
    this.month = m
    this.day = d
    this.color = color
    this.isActive = isActive ? isActive : false
  }
}
</script>
