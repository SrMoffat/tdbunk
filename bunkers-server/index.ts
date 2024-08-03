import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly bunker: Party.Room) { }

  async onRequest(req: Party.Request) {
    console.log("request here")
    return new Response(`This is bunker`);
  }

  async onMessage(message: string, sender: Party.Connection) {
    this.bunker.broadcast(message, [sender.id])
    console.log("Connections", Array.from(this.bunker.getConnections()).map(conn => conn.id))
    // sender.send('pong')
  }

  async onConnect(connection: Party.Connection) {
    // connection.send('Connected')
    const connectionCount = Array.from(this.bunker.getConnections()).length

    // this.bunker.broadcast(JSON.stringify({connectionCount}))
    // this.bunker.broadcast(`New Connection ${connection.id}`)
    
  }

  async onClose(connection: Party.Connection){
    console.log(`Connection ${connection.id} left the bunker`)
  }
}

