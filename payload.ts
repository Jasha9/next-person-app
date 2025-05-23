import payload from 'payload'
import config from './payload.config' // Adjust path if your config is elsewhere

// Initialize Payload only once (singleton pattern)
let payloadInstance: typeof payload | null = null

const getPayloadClient = async () => {
  if (!payloadInstance) {
    await payload.init({
      config,
    })
    payloadInstance = payload
  }
  return payloadInstance
}

export default await getPayloadClient()
