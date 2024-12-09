export async function getWeather(city) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`

  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error("Error fetching weather data.")
  }

  const data = await response.json()
  return data
}
