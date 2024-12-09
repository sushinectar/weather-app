"use client"

import React, { useState, useEffect } from "react"
import { getWeather } from "@/lib/weather"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [city, setCity] = useState("São Paulo")
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  // Mapping descriptions to image URLs
  const weatherImages = {
    "céu limpo": "/sunny.png",
    "nuvens quebradas": "/break-cloud.png",
    "nuvens dispersas": "/break-cloud.png",
    "chuva fraca": "/short-rain.png",
    "céu pouco nublado": "/cloudy.png",
    "neve fraca": "/snow.png",
    nublado: "/cloudy.png",
  }

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
    <main className="flex flex-col justify-center align-center text-center item-center p-4 gap-4">
      <h1 className="text-2xl font-bold">Clima Atual</h1>
      <div className="mx-2 p-4 border-2 rounded-lg">
        <Input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="mt-4 p-2 border"
          placeholder="Digite uma cidade"
        />
        {error && <p className="text-red-500">{error}</p>}
        {weather && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-col mt-2 mb-6 gap-2">
              <div className="flex justify-center">
                {/* Bandeira do país */}
                <div className="text-sm">
                  <img
                    src={`https://flagsapi.com/${weather.sys.country}/flat/64.png`}
                    width={30}
                    height={30}
                    alt="Bandeira do país"
                  />
                </div>
                <h2 className="text-lg mx-2">{weather.name}</h2>
              </div>
              {/* Weather image display */}
              <div className="flex flex-col justify-center mt-4">
                <img
                  src={weatherImages[weather.weather[0].description]}
                  alt="Imagem do clima"
                  width={100}
                  height={100}
                />
              </div>
              {/* Temperatura */}
              <p className="text-4xl mt-2">{Math.round(weather.main.temp)}°C</p>
              {/* Weather description */}
              <div className="text-sm">{weather.weather[0].description}</div>
            </div>
            <div className="flex flex-col items-center w-72 pb-4 pt-6 mb-4 border rounded-md">
              {/* Temperaturas máxima, mínima e umidade */}
              <div className="flex gap-12">
                <div className="flex flex-col items-center gap-2 text-md">
                  <img src="/maximum.png" alt="Icon" width={40} height={40} />
                  {Math.round(weather.main.temp_max)}°C
                </div>
                <div className="flex flex-col items-center gap-2 text-md">
                  <img src="/minimum.png" alt="Icon" width={40} height={40} />
                  {Math.round(weather.main.temp_min)}°C
                </div>
                {/* Umidade e descrição */}
                <div className="flex flex-col items-center gap-2 text-md">
                  <img src="humidity.png" alt="Icon" width={40} height={40} />
                  {weather.main.humidity}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
