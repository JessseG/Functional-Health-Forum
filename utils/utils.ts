export async function fetchData(url) {
  const res = await fetch(url);
  const response = await res.json();
  return response;
}
