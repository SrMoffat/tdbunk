import type * as Party from "partykit/server";

export type Poll = {
  title: string;
  options: string[];
  votes?: number[];
};

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  poll: Poll | undefined;

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const poll = (await req.json()) as Poll;
      this.poll = { ...poll, votes: poll.options.map(() => 0) };
      this.savePoll();
    }

    if (this.poll) {
      return new Response(JSON.stringify(this.poll), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send("hello from server");
  }

  async onMessage(message: string) {
    if (!this.poll) return;

    const event = JSON.parse(message);
    if (event.type === "vote") {
      this.poll.votes![event.option] += 1;
      this.room.broadcast(JSON.stringify(this.poll));
      this.savePoll();
    }
  }

  // onMessage(message: string, sender: Party.Connection) {
  //   // let's log the message
  //   console.log(`connection ${sender.id} sent message: ${message}`);
  //   // as well as broadcast it to all the other connections in the room...
  //   this.room.broadcast(
  //     `${sender.id}: ${message}`,
  //     // ...except for the connection it came from
  //     [sender.id]
  //   );
  // }

  async savePoll() {
    if (this.poll) {
      await this.room.storage.put<Poll>("poll", this.poll);
    }
  }

  async onStart() {
    this.poll = await this.room.storage.get<Poll>("poll");
  }
}

Server satisfies Party.Worker;
