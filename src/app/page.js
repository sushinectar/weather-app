"use client"

import "./media.css"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Moon, Sun } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { getWeather } from "@/lib/weather"
import { getGeo } from "@/lib/geo"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
    "chuva moderada": "/short-rain.png",
    "chuva forte": "/short-rain.png",
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
      <main className="flex flex-col text-center p-4 gap-4 transition-colors duration-500 ease-in-out">
        <nav className="flex justify-around items-center my-4">
          <h1 className="text-2xl font-bold">Weather App</h1>
          <ModeToggle /> {/* Replace the button with the ModeToggle component */}
        </nav>
        <div className="box-container mx-2 p-4 border border-zinc-200 rounded-lg shadow-md shadow-zinc-400 transition-all duration-500 ease-in-out">
          <div>
            <span className="search-img relative top-custom left-4 pointer-events-none">
              <img src="/search.png" alt="Lupa" className="w-4 h-4 filter dark:invert" />
            </span>
            <Input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="mt-4 pb-6 pl-14 pt-6 border top border-zinc-200 shadow-md shadow-zinc-300"
              placeholder="Digite uma cidade"
            />
          </div>
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
                    className="filter dark:invert"
                  />
                </div>
                {/* Temperature */}
                <p className="text-4xl mt-2">{Math.round(weather.main.temp)}°C</p>
                {/* Weather description */}
                <div className="text-sm text-zinc-700 my-2">
                  {capitalizeFirstLetter(weather.weather[0].description)}
                </div>
              </div>
              <div className="flex flex-col items-center w-72 pb-4 pt-6 mb-4">
                {/* Maximum, minimum temperatures and humidity */}
                <div className="flex gap-14">
                  <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                    <img
                      src="/max.png"
                      alt="Temperatura maxima"
                      width={30}
                      height={30}
                      className="filter dark:invert"
                    />
                    {Math.round(weather.main.temp_max)}°C
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                    <img
                      src="/min.png"
                      alt="Temperatura minima"
                      width={30}
                      height={30}
                      className="filter dark:invert"
                    />
                    {Math.round(weather.main.temp_min)}°C
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-zinc-600">
                    <img src="humidity.png" alt="Umidade" width={30} height={30} className="filter dark:invert" />
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
