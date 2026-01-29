const generateTempPassword = () => {
  return Math.random().toString(36).slice(-8) + "@A1";
};

export default generateTempPassword;
