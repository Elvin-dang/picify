import moment from "moment";

export const toTimeString = (value?: string) => {
  return moment(value).format("MMMM DD YYYY, h:mm A");
};
