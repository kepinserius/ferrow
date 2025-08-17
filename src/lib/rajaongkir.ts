export async function callRajaOngkir(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const apiKey = process.env.RAJAONGKIR_API_KEY

  if (!apiKey) {
    throw new Error("RAJAONGKIR_API_KEY is not configured")
  }

  const url = `https://api.rajaongkir.com/starter/${endpoint}`

  console.log(`[RajaOngkir] Fetching: ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: {
      key: apiKey,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Raja Ongkir API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (data.rajaongkir.status.code !== 200) {
    throw new Error(data.rajaongkir.status.description)
  }

  return data.rajaongkir.results
}
