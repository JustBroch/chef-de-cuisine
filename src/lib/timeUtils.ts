// Helper function to format cooking time with ranges for better readability
export function formatCookingTime(minutes: number | null | undefined): string {
  if (!minutes) return "N/A";
  
  // For short times, show exact minutes
  if (minutes <= 30) {
    return `${minutes} mins`;
  }
  
  // For 30-60 minutes, show ranges
  if (minutes <= 60) {
    const lowerBound = Math.floor(minutes / 10) * 10;
    const upperBound = lowerBound + 10;
    return `${lowerBound}-${upperBound} mins`;
  }
  
  // For longer times, show hour ranges
  const hours = minutes / 60;
  if (hours <= 2) {
    const lowerHour = Math.floor(hours * 2) / 2; // Round to nearest 0.5
    const upperHour = lowerHour + 0.5;
    return `${lowerHour}-${upperHour} hours`;
  }
  
  // For very long recipes, show approximate hours
  const roundedHours = Math.round(hours);
  return `~${roundedHours} hours`;
} 