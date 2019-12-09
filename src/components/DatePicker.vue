<template>
  <div>
    <input
      type="text"
      :value="value"
      @input="updateBinding"
      @focus="openDatePicker"
      @blur="verifyBlur"
    />
    <div v-if="isShowDatepicker" class="date-picker">
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
                :class="{ active: calendarDate.isActive }"
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
    value: {
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
      container: null,
      isShowDatepicker: false,
      isCheckSelected: false,
      yyyyMMdd: new RegExp(
        /^[1-9]\d{2,3}-((0[1-9]|[1-9])|1[0-2])-((0[1-9]|[1-9])|[1-2][0-9]|3[0-1])$/
      ),
      yyyyMM: new RegExp(/^[1-9]\d{2,3}-((0[1-9]|[1-9])|1[0-2])$/),
      yyyy: new RegExp(/^[1-9]\d{2,3}$/)
    }
  },
  watch: {
    value: {
      handler: function(newVal, oldVal) {
        if (!this.isBlank(newVal) && !Object.is(newVal, oldVal)) {
          this.openDatePicker()
          if (Object.is(this.isCheckSelected, true)) {
            this.closeDatepicker()
            this.isCheckSelected = false
          }
        } else {
          this.closeDatepicker()
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.today = new Date()
    this.refreshSelectedDate(
      this.today.getFullYear(),
      this.today.getMonth() + 1,
      this.today.getDate()
    )
    this.replacePage('day', this.selectedDate)
  },
  methods: {
    updateBinding(e) {
      this.$emit('input', e.target.value)
    },
    verifyBlur(e) {
      // if (Object.is(this.isCheckSelected, true)) {
      //   this.closeDatepicker()
      // }
    },
    closeDatepicker() {
      this.isShowDatepicker = false
    },
    openDatePicker() {
      this.isShowDatepicker = true
      const thisInput = this.value
      if (!this.isBlank(thisInput)) {
        thisInput.includes('-')

        if (this.yyyy.test(thisInput)) {
          this.selectedDate.year = parseInt(thisInput)
          this.replacePage('year', { year: this.selectedDate.year })
        } else if (this.yyyyMM.test(thisInput)) {
          const input = thisInput.split('-')
          this.selectedDate.year = parseInt(input[0])
          this.selectedDate.month = parseInt(input[1])
          this.replacePage('month', {
            year: this.selectedDate.year,
            month: this.selectedDate.month
          })
        } else if (this.yyyyMMdd.test(thisInput)) {
          const input = thisInput.split('-')
          this.refreshSelectedDate(
            parseInt(input[0]),
            parseInt(input[1]),
            parseInt(input[2])
          )
          this.replacePage('day', this.selectedDate)
        }
      }
    },
    replacePage(targetMode, refDate) {
      this.pageMode = targetMode

      if (Object.is('year', targetMode)) {
        const bound = YearUtil.getYearBound(refDate.year)
        this.calendarTitle = `${bound.lower} - ${bound.upper}`
        this.container = YearUtil.fillYears(
          bound,
          this.selectedDate,
          this.today
        )
      } else if (Object.is('month', targetMode)) {
        this.calendarTitle = `${refDate.year}`
        this.container = MonthUtil.fillMonths(
          refDate,
          this.selectedDate,
          this.today
        )
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
        const title = this.calendarTitle.split(' - ')
        const from = title[0]
        const to = title[1]
        const refDate = {
          year: Object.is('left', direction)
            ? parseInt(from) - 9
            : parseInt(to) + 9
        }
        this.replacePage('year', refDate)
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
        const refDate = {
          year: calendarDate.year
        }
        this.replacePage('month', refDate)
      } else if (Object.is(this.pageMode, 'month')) {
        const refDate = {
          year: calendarDate.year,
          month: calendarDate.month
        }
        this.replacePage('day', refDate)
      } else if (Object.is(this.pageMode, 'day')) {
        this.refreshSelectedDate(
          calendarDate.year,
          calendarDate.month,
          calendarDate.day
        )
        this.$emit(
          'input',
          `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`
        )
        this.isCheckSelected = true
      }
    },
    refreshSelectedDate(y, m, d) {
      if (y) {
        this.selectedDate.year = y
      }

      if (m) {
        this.selectedDate.month = m
        this.selectedDate.monthSrc = MonthUtil.month2Src(
          this.selectedDate.month
        )
      }

      if (d) {
        this.selectedDate.day = d
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
    isBlank(value) {
      return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value)
    }
  }
}
</script>
