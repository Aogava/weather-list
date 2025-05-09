const convertMillisecondsToRelativeDate = (milliseconds) => {
  const date = new Date(milliseconds);
  const currentDate = new Date();
  let finalResult = {
    relativeDate: null,
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
  const weekDayName = date.toLocaleDateString("en-US", { weekday: "long" });
  // const millisecondsInDay = 24 * 60 * 60 * 1000;

  if (date.setHours(0, 0, 0, 0) == currentDate.setHours(0, 0, 0, 0)) {
    finalResult.relativeDate = "Today";
  } else {
    finalResult.relativeDate = weekDayName;
  }

  return finalResult;
};

export default convertMillisecondsToRelativeDate;
