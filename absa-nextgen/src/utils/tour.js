export const getTourStep = () => {
  return Number(localStorage.getItem("tourStep") || 0);
};

export const setTourStep = (step) => {
  localStorage.setItem("tourStep", step);
};

export const completeTour = () => {
  localStorage.setItem("tourDone", "true");
};

export const isTourDone = () => {
  return localStorage.getItem("tourDone") === "true";
};
