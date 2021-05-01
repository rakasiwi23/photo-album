export const httpRequest = async (type: "albums" | "users" | "photos") => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/${type}`);
  return response.json();
};
