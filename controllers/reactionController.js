module.exports = {
  formatTimestamp(datetime) {
    const date = new Date(datetime);
    // MDN article on .toLocaleDateString helped me here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

    const dayOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // also article on .DateTimeFormat(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    const timeOptions = {
      hour: "numeric",
      minute: "2-digit",
    };
    const day = date.toLocaleDateString("en-US", dayOptions);
    const time = date.toLocaleTimeString("en-US", timeOptions);

    return day + " at " + time;
  },
};
