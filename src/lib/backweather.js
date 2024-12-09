export default async function handler(req, res) {
  const { city } = req.query
  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: "A chave de API não foi configurada." })
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt&appid=${apiKey}`
    )

    if (!response.ok) {
      return res.status(response.status).json({ error: "Erro ao buscar dados do clima na API externa." })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor." })
  }
}
