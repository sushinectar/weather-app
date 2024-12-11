"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

import { getWeather } from "@/lib/weather"
import { getGeo } from "@/lib/geo"

export default function Home() {
  const [city, setCity] = useState("São Paulo")
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const { theme, setTheme } = useTheme()

  // Mapping descriptions to image URLs
  const weatherImages = {
    "céu limpo": "/sunny.png",
    "nuvens quebradas": "/break-cloud.png",
    "nuvens dispersas": "/break-cloud.png",
    "chuva fraca": "/short-rain.png",
    "céu pouco nublado": "/cloudy.png",
    "neve fraca": "/snow.png",
    nublado: "/cloudy.png",
    trovoada: "/lightning.png",
  }

  // Capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  useEffect(() => {
    // Fetch user's geolocation and update the city
    async function fetchGeoAndWeather() {
      try {
        const geoData = await getGeo()
        if (geoData && geoData.city) {
          setCity(geoData.city) // Update the name of the detected city
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error)
      }
    }

    fetchGeoAndWeather()
  }, [])

  useEffect(() => {
    // Fetch weather data whenever the city changes
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
    <ThemeProvider>
      <main className="flex flex-col justify-center align-center text-center item-center p-4 gap-4">
        <nav className="flex justify-around items-center my-10">
          <h1 className="text-2xl font-bold">Weather App</h1>
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle Theme</Button>
        </nav>
        <div className="mx-2 p-4 border border-zinc-400 rounded-lg shadow-lg shadow-zinc-400">
          <span className="absolute top-custom left-16 flex items-center pointer-events-none">
            <img src="/search.png" alt="Lupa" className="w-4 h-4" />
          </span>
          <Input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="mt-4 pb-6 pl-14 pt-6 border border-zinc-400"
            placeholder="Digite uma cidade"
          />
          {error && <p className="text-red-500">{error}</p>}
          {weather && (
            <div className="flex flex-col items-center mt-4">
              <div className="flex flex-col mt-8 mb-6 gap-2">
                <div className="flex justify-center">
                  {/* Country flag */}
                  <div className="text-sm">
                    <img
                      src={`https://flagsapi.com/${weather.sys.country}/flat/64.png`}
                      width={30}
                      height={30}
                      alt="Bandeira do país"
                    />
                  </div>
                  <h2 className="text-lg mx-2 mb-2">{weather.name}</h2>
                </div>
                {/* Weather image display */}
                <div className="flex flex-col items-center mt-6">
                  <img
                    src={weatherImages[weather.weather[0].description]}
                    alt="Imagem do clima"
                    width={100}
                    height={100}
                  />
                </div>
                {/* Temperature */}
                <p className="text-4xl mt-2">{Math.round(weather.main.temp)}°C</p>
                {/* Weather description */}
                <div className="text-sm text-zinc-700 my-2">{capitalizeFirstLetter(weather.weather[0].description)}</div>
              </div>
              <div className="flex flex-col items-center w-72 pb-4 pt-6 mb-4 drop-shadow-sm">
                {/* Maximum, minimum temperatures and humidity */}
                <div className="flex gap-14">
                  <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                    <img src="/max.png" alt="Temperatura maxima" width={30} height={30} />
                    {Math.round(weather.main.temp_max)}°C
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                    <img src="/min.png" alt="Temperatura minima" width={30} height={30} />
                    {Math.round(weather.main.temp_min)}°C
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                    <img src="humidity.png" alt="Umidade" width={30} height={30} />
                    {weather.main.humidity}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ThemeProvider>
  )
}
