export const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

const findMaxDayOfMonth = (month) => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 2:
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
  }
};

const padNum = (num) => String(num).padStart(2, '0');
export const getLocalDateStr = (date, dayOffset = 0, hourOffset = 0) => {
  const d = new Date(date);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();

  let maxDay = findMaxDayOfMonth(month);

  if (day + dayOffset > maxDay) {
    if (month == 12) {
      year += 1;
      month = 1;
      day = day + dayOffset - maxDay;
    } else {
      month += 1;
      day = day + dayOffset - maxDay;
    }
  } else if (day + dayOffset < 1) {
    if (month == 1) {
      year -= 1;
      month = 12;
      day = findMaxDayOfMonth(month) + day + dayOffset;
    } else {
      month -= 1;
      day = findMaxDayOfMonth(month) + day + dayOffset;
    }
  } else {
    day = day + dayOffset;
  }
  return `${year}-${padNum(month)}-${padNum(
    day
  )}T${padNum(d.getHours() + hourOffset)}:${padNum(d.getMinutes())}:${padNum(
    d.getSeconds()
  )}`;
};
