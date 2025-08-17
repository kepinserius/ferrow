export const getMidtransConfig = () => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  const clientKey = process.env.MIDTRANS_CLIENT_KEY
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true"

  if (!serverKey || !clientKey) {
    throw new Error("Missing Midtrans configuration")
  }

  return {
    serverKey,
    clientKey,
    isProduction,
    snapUrl: isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions",
    authString: Buffer.from(serverKey + ":").toString("base64"),
  }
}
