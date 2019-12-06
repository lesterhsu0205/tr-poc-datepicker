<template>
  <div>
    {{ `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}` }}
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
                    {{ calendarDate.monthSrc }}
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
import DaysUtil from './../assets/js/dayUtil'
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
      selectedDate: {},
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
    this.refreshSelectedDate(this.today)
    this.changeMode('day')
  },
  methods: {
    changeMode(targetMode, refDate) {
      this.pageMode = targetMode

      if (!refDate) {
        refDate = this.selectedDate
      }

      if (Object.is('year', targetMode)) {
        console.log('TODO')
      } else if (Object.is('month', targetMode)) {
        this.calendarTitle = `${refDate.year}`
        this.container = MonthUtil.fillMonths(refDate)
      } else if (Object.is('day', targetMode)) {
        this.calendarTitle = `${refDate.monthSrc} ${refDate.year}`
        this.fillDays()
      }
    },
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
      const calendarTitle = this.parseCalendarTitle()

      let refDate

      if (
        this.selectedDate &&
        this.selectedDate.year &&
        this.selectedDate.month &&
        this.selectedDate.monthSrc &&
        this.selectedDate.day
      ) {
        refDate = this.selectedDate
      } else {
        refDate = {
          year: calendarTitle.year,
          month: calendarTitle.month,
          monthSrc: calendarTitle.monthSrc,
          day: 1
        }
      }

      if (Object.is(this.pageMode, 'month')) {
        this.changeMode('year', refDate)
      } else if (Object.is(this.pageMode, 'day')) {
        this.changeMode('month', refDate)
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

      this.refreshSelectedDate(toogleDate)

      if (Object.is(this.pageMode, 'year')) {
        this.changeMode('month')
      } else if (Object.is(this.pageMode, 'month')) {
        this.changeMode('day')
      }
    },
    processCallByMode(call) {
      if (Object.is('day', this.pageMode) && call) {
        call()
      } else if (Object.is('month', this.pageMode) && call) {
        call()
      } else if (Object.is('year', this.pageMode) && call) {
        call()
      }
    },
    refreshSelectedDate(date) {
      this.selectedDate.year = date.getFullYear()

      if (this.pageMode == null || Object.is('day', this.pageMode)) {
        this.selectedDate.month = date.getMonth() + 1
        this.selectedDate.monthSrc = MonthUtil.month2Src(
          this.selectedDate.month
        )
        this.selectedDate.day = date.getDate()
        this.selectedDate.dayOfTheWeek = date.getDay() // Sunday - Saturday : 0 - 6
      }

      if (Object.is('month', this.pageMode)) {
        this.selectedDate.month = date.getMonth() + 1
        this.selectedDate.monthSrc = MonthUtil.month2Src(
          this.selectedDate.month
        )
        this.selectedDate.day = ''
        this.selectedDate.dayOfTheWeek = ''
      }
    },
    fillDays() {
      const parsedCalendar = this.parseCalendarTitle()
      const year = parsedCalendar.year
      const month = parsedCalendar.month
      const indexOfWeek = new Date(year, month - 1, 1).getDay()
      const daysInMonth = MonthUtil.getEndDayInMonth(year, month)
      const lastYearMonth = this.getRelativeYearMonth(year, month, -1)
      const nextYearMonth = this.getRelativeYearMonth(year, month, +1)

      this.container = DaysUtil.fillDays(
        parsedCalendar,
        indexOfWeek,
        daysInMonth,
        lastYearMonth,
        nextYearMonth,
        this.today,
        this.selectedDate
      )
    },
    parseCalendarTitle() {
      const titleDateArray = this.calendarTitle.split(' ')
      const year = titleDateArray[1]
      const monthSrc = titleDateArray[0]
      return {
        year: parseInt(year),
        month: MonthUtil.src2Month(monthSrc),
        monthSrc: monthSrc
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
