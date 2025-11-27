export const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString(); // you can customize if you want
};
