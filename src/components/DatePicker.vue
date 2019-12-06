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
import YearUtil from './../assets/js/yearUtil'
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
    this.replacePage('day', this.selectedDate)
  },
  methods: {
    replacePage(targetMode, refDate) {
      this.pageMode = targetMode

      if (Object.is('year', targetMode)) {
        const bound = YearUtil.getYearBound(refDate.year)
        this.calendarTitle = `${bound.lower} - ${bound.upper}`
        this.container = YearUtil.fillYears(bound, this.selectedDate)
      } else if (Object.is('month', targetMode)) {
        this.calendarTitle = `${refDate.year}`
        this.container = MonthUtil.fillMonths(refDate, this.selectedDate)
      } else if (Object.is('day', targetMode)) {
        this.calendarTitle = `${MonthUtil.month2Src(refDate.month)} ${
          refDate.year
        }`
        this.fillDays()
      }
    },
    toggleTitle() {
      if (Object.is(this.pageMode, 'month')) {
        this.replacePage('year', { year: parseInt(this.calendarTitle) })
      } else if (Object.is(this.pageMode, 'day')) {
        // 參考 title
        const calendarTitle = DayUtil.parseCalendarTitle(this.calendarTitle)
        let refDate = {
          year: calendarTitle.year,
          month: calendarTitle.month,
          monthSrc: calendarTitle.monthSrc,
          day: this.selectedDate.day ? this.selectedDate.day : 1
        }
        this.replacePage('month', refDate)
      }
    },
    togglePage(direction) {
      if (Object.is(this.pageMode, 'year')) {
        // TODO
      } else if (Object.is(this.pageMode, 'month')) {
        const year = parseInt(this.calendarTitle)

        const refDate = {
          year: Object.is('left', direction) ? year - 1 : year + 1
        }

        this.replacePage('month', refDate)
      } else if (Object.is(this.pageMode, 'day')) {
        const currParsedTitle = DayUtil.parseCalendarTitle(this.calendarTitle)
        const lastYearMonth = DayUtil.getRelativeYearMonth(
          currParsedTitle.year,
          currParsedTitle.month,
          Object.is('left', direction) ? -1 : 1
        )
        this.replacePage('day', {
          year: lastYearMonth.year,
          month: lastYearMonth.month
        })
      }
    },
    toggle(calendarDate) {
      for (let i = 0; i < this.container.length; i++) {
        for (let j = 0; j < this.container[i].length; j++) {
          this.container[i][j].isActive = false
        }
      }

      calendarDate.isActive = true

      // fetch array in vue
      this.container[0].splice(0, 0)

      if (Object.is(this.pageMode, 'year')) {
        // TODO
      } else if (Object.is(this.pageMode, 'month')) {
        const refDate = {
          year: calendarDate.year,
          month: calendarDate.month
        }
        this.replacePage('day', refDate)
      } else if (Object.is(this.pageMode, 'day')) {
        const toogleDate = new Date(
          calendarDate.year,
          calendarDate.month - 1,
          calendarDate.day
        )
        this.refreshSelectedDate(toogleDate)
      }
    },
    refreshSelectedDate(date) {
      if (date instanceof Date) {
        this.selectedDate.year = date.getFullYear()
        this.selectedDate.month = date.getMonth() + 1
        this.selectedDate.monthSrc = MonthUtil.month2Src(
          this.selectedDate.month
        )
        this.selectedDate.day = date.getDate()
        this.selectedDate.dayOfTheWeek = date.getDay() // Sunday - Saturday : 0 - 6
      }
    },
    fillDays() {
      const parsedCalendar = DayUtil.parseCalendarTitle(this.calendarTitle)
      const year = parsedCalendar.year
      const month = parsedCalendar.month
      const indexOfWeek = new Date(year, month - 1, 1).getDay()
      const daysInMonth = MonthUtil.getEndDayInMonth(year, month)
      const lastYearMonth = DayUtil.getRelativeYearMonth(year, month, -1)
      const nextYearMonth = DayUtil.getRelativeYearMonth(year, month, +1)

      this.container = DayUtil.fillDays(
        parsedCalendar,
        indexOfWeek,
        daysInMonth,
        lastYearMonth,
        nextYearMonth,
        this.today,
        this.selectedDate
      )
    },
    clearSelectedDate() {
      this.selectedDate = {}
    }
  }
}
</script>
