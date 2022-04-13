import { WebSocket } from "ws"

// Implements patterns found here:
// https://gist.github.com/ismasan/299789
export default class EventRouter {
  private readonly websocket: WebSocket
  private events: Record<string, Array<(...args: any) => void>> = {}

  constructor(websocket: WebSocket) {
    this.websocket = websocket

    this.websocket.on("message", (data) => {
      let jsonData: {
        event: string,
        data: object
      }

      try {
        jsonData = JSON.parse(data.toString())
      } catch (error) {
        this.websocket.send("Sent format not JSON.")
        throw new TypeError("Data type not JSON.")
      }

      this.dispatch(jsonData.event, jsonData.data)
    })
  }

  // gets called when used.
  public bind(event_name: string, callback: (data: object) => void) {
    // If the event name doesn't exist as a bound event, initialize it as an empty array.
    this.events[event_name] ||= []
    this.events[event_name].push(callback)
    return this
  }

  private dispatch(event_name: string, message: object) {
    const eventChain = this.events[event_name]

    if (typeof eventChain === "undefined") {
      this.websocket.send("No event with name " + event_name)
      return
    }

    for (const event of eventChain) {
      event(message)
    }
  }
}
