class MiniDayjs {
  constructor(date) {
    // Handle ms, date strings, or Date objects
    this.$d = date ? new Date(date) : new Date();
  }

  // Format the date using tokens like Day.js
  format(formatStr) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dict = {
      YYYY: this.$d.getFullYear(),
      MMMM: months[this.$d.getMonth()],
      MMM: months[this.$d.getMonth()].substring(0, 3),
      MM: String(this.$d.getMonth() + 1).padStart(2, '0'),
      DD: String(this.$d.getDate()).padStart(2, '0'),
      D: this.$d.getDate(),
      dddd: days[this.$d.getDay()],
      ddd: days[this.$d.getDay()].substring(0, 3),
    };

    return formatStr.replace(/YYYY|MMMM|MMM|MM|DD|D|dddd|ddd/g, (match) => dict[match]);
  }

  // Basic manipulation: .add(1, 'day')
  add(number, unit) {
    const date = new Date(this.$d);
    if (unit === 'day' || unit === 'days') date.setDate(date.getDate() + number);
    if (unit === 'month' || unit === 'months') date.setMonth(date.getMonth() + number);
    if (unit === 'year' || unit === 'years') date.setFullYear(date.getFullYear() + number);
    return new MiniDayjs(date);
  }

  // Return the raw Date object
  toDate() {
    return this.$d;
  }
}

// Export a function that mimics the dayjs() syntax
const miniDayjs = (date) => new MiniDayjs(date);

export default miniDayjs;