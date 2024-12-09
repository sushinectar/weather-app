export async function getWeather(city) {
  const response = await fetch(`/api/weather?city=${city}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar os dados do clima.")
  }

  return response.json()
}
