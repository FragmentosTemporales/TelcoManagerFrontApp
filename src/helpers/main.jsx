const extractDate = (gmtString) => {
  const date = new Date(gmtString);

  // Restar 4 horas al tiempo
  date.setUTCHours(date.getUTCHours() - 4);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year} `;
  
  return formattedDateTime;
};

export default extractDate;
