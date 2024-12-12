export async function getGeo() {
  const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY
  const endpoint = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`

  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error("Error fetching geo data.")
  }

  const data = await response.json()
  return data
}
