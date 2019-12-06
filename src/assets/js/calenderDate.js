export default class CalenderDate {
  constructor(y, m, msrc, d, color, isActive) {
    this.year = y
    this.month = m
    this.monthSrc = msrc
    this.day = d
    this.color = color
    this.isActive = isActive ? isActive : false
  }
}
