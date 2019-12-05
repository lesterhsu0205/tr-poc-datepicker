export default class CalenderDate {
  constructor(y, m, d, color, isActive) {
    this.year = y
    this.month = m
    this.day = d
    this.color = color
    this.isActive = isActive ? isActive : false
  }
}
