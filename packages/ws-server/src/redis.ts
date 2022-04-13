import { createClient, RedisClientOptions } from "redis"

export default class RedisClient {
  readonly client

  constructor(options: RedisClientOptions) {
    this.client = createClient(options)

    this.client.on("error", (err) => {
      console.error("Redis error: ", err)
    })
  }

  async connect() {
    this.client.connect()
        .then(() => {
          console.log(`Redis connected to: ${this.client.options?.url}`)
        })
    return this
  }
}

