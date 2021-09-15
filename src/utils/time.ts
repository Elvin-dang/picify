import moment from "moment";

export const toTimeString = (value?: string) => {
  return moment(value).format("MMMM DD YYYY, h:mm A");
};

export const toDurationString = (value?: string) => {
  if (!value) return "00:00";
  const min = Math.floor(+value / 60);
  const sec = +value % 60;
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
};
