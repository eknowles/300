const formatDate = (date) => {
  const [, month, , year] = new Date(date).toDateString().split(' ');
  return `${month} ${year}`;
};

export default formatDate;
