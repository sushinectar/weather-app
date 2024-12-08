"use client"

import { useState, useEffect } from "react"
import { getWeather } from "@/lib/weather"

export default function Home() {
  const [city, setCity] = useState("São Paulo")
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeather(city)
        setWeather(data)
        setError(null) // Reset any previous errors
      } catch (error) {
        setError(error.message)
      }
    }

    fetchWeather()
  }, [city])

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Clima Atual</h1>
      <input
        type="text"
        value={city}
        onChange={e => setCity(e.target.value)}
        className="mt-4 p-2 border"
        placeholder="Digite uma cidade"
      />
      {error && <p className="text-red-500">{error}</p>}
      {weather && (
        <div className="mt-4">
          <h2 className="text-lg">{weather.name}</h2>
          <p className="text-2xl">{weather.main.temp}°C</p>
          <p className="text-sm">{weather.weather[0].description}</p>
        </div>
      )}
    </main>
  )
}
