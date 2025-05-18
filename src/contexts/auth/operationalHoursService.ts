
// Check if the current time is within operational hours (4am to 11:59pm PT)
export const checkOperationalHours = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  
  // Operational hours: 4am to 11:59pm (4-23)
  return hour >= 4 && hour < 24;
};
