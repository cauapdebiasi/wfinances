/*This function returns the complete date formatted with only the essential parts needed to the card */
function date_formatter() {
    const now = new Date();
    const dateToFormat = now.toString();
    let dateParts = dateToFormat.split(" ");
    let month = now.getMonth();
    let formattedDate = {
      year: dateParts[3],
      month: month + 1,
      day: dateParts[2],
      hours: dateParts[4],
    };
    return formattedDate;
  }