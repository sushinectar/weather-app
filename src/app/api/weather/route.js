import handler from "@/lib/backweather"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city")

  if (!city) {
    return new Response(JSON.stringify({ error: "A cidade não foi fornecida." }), { status: 400 })
  }

  try {
    const response = await handler({ query: { city } }, { status: code => ({ json: data => data }) })

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
