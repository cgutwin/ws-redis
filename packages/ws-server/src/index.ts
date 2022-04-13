import { AddressInfo, WebSocketServer } from "ws"
import { env } from "./constants"
import RedisClient from "./redis"
import EventRouter from "@pubsub-ws/ws-event-router"

const ws = new WebSocketServer({
  port: env.PORT
})

const redis = new RedisClient({
  url: `redis://${env.redis.HOST}:${env.redis.PORT}`
})

redis.connect()

ws.on("listening", function listening() {
  const { port, address } = this.address() as AddressInfo
  console.log(`Listening on ${address}:${port}`)
})

ws.on("connection", (socket) => {
  const router = new EventRouter(socket)

  router.bind("ping", () => {
    socket.send("pong")
  })
})

export default ws
