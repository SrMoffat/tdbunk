import type * as Party from "partykit/server";
import { nanoid } from "nanoid";
import { User } from "@/bunkers-server/utils/auth";
import { SINGLETON_ROOM_ID } from "@/bunkers-server/bunkers";
import type {
    Message,
    SyncMessage,
    UserMessage,
    ClearRoomMessage,
} from "@/bunkers-server/utils/message";
import {
    editMessage,
    newMessage,
    syncMessage,
    systemMessage,
} from "@/bunkers-server/utils/message";
import { error, json, notFound, ok } from "./utils/response";

const DELETE_MESSAGES_AFTER_INACTIVITY_PERIOD = 1000 * 60 * 60 * 24; // 24 hours

// track additional information on bunker and connection objects

type ChatConnectionState = { user?: User | null };

type ChatConnection = Party.Connection<ChatConnectionState>;

/**
 * This party manages the state and behaviour of an individual bunker
 */
export default class BunkerServer implements Party.Server {
    messages?: Message[];
    botId?: string;
    constructor(public bunker: Party.Room) { }

    /** Retrieve messages from bunker storage and store them on bunker instance */
    async ensureLoadMessages() {
        console.log("ensureLoadMessages")
        if (!this.messages) {
            this.messages =
                (await this.bunker.storage.get<Message[]>("messages")) ?? [];
        }
        return this.messages;
    }

    /** Clear bunker storage */
    async removeRoomMessages() {
        await this.bunker.storage.delete("messages");
        this.messages = [];
    }

    /** Remove this bunker from the bunkers listing party */
    async removeRoomFromRoomList(id: string) {
        return this.bunker.context.parties.bunkers.get(SINGLETON_ROOM_ID).fetch({
            method: "POST",
            body: JSON.stringify({
                id,
                action: "delete",
            }),
        });
    }

    /** Send bunker presence to the bunkers listing party */
    async updateRoomList(action: "enter" | "leave", connection: ChatConnection) {
        return this.bunker.context.parties.chatrooms.get(SINGLETON_ROOM_ID).fetch({
            method: "POST",
            body: JSON.stringify({
                id: this.bunker.id,
                connections: [...this.bunker.getConnections()].length,
                user: connection.state?.user,
                action,
            }),
        });
    }

    /**
     * Responds to HTTP requests to /parties/chatroom/:roomId endpoint
     */
    async onRequest(request: Party.Request) {
        const messages = await this.ensureLoadMessages();
        // mark bunker as created by storing its id in object storage
        if (request.method === "POST") {
            await this.bunker.storage.put("id", this.bunker.id);
            return ok();
        }

        // return list of messages for server rendering pages
        if (request.method === "GET") {
            if (await this.bunker.storage.get("id")) {
                return json<SyncMessage>({ type: "sync", messages });
            }
            return notFound();
        }

        // clear bunker history
        if (request.method === "DELETE") {
            await this.removeRoomMessages();
            this.bunker.broadcast(JSON.stringify(<ClearRoomMessage>{ type: "clear" }));
            this.bunker.broadcast(
                newMessage({
                    from: { id: "system" },
                    text: `Room history cleared`,
                })
            );
            return ok();
        }

        // respond to cors preflight requests
        if (request.method === "OPTIONS") {
            return ok();
        }

        return notFound();
    }

    /**
     * Executes when a new WebSocket connection is made to the bunker
     */
    async onConnect(connection: ChatConnection) {
        console.log("Connected")
        // await this.ensureLoadMessages();

        // // send the whole list of messages to user when they connect
        // connection.send(syncMessage(this.messages ?? []));

        // // keep track of connections
        // this.updateRoomList("enter", connection);
    }

    async onMessage(
        messageString: string,
        connection: Party.Connection<{ user: User | null }>
    ) {
        // const message = JSON.parse(messageString) as UserMessage;
        // // handle user messages
        // if (message.type === "new" || message.type === "edit") {
        //     const user = connection.state?.user ?? {
        //         username: '4fr0c0d3',
        //         image: ''
        //     };

        //     if (message.text.length > 1000) {
        //         return connection.send(systemMessage("Message too long"));
        //     }

        //     const payload = <Message>{
        //         id: message.id ?? nanoid(),
        //         from: { id: user.username, image: user.image },
        //         text: message.text,
        //         at: Date.now(),
        //     };

        //     // send new message to all connections
        //     if (message.type === "new") {
        //         this.party.broadcast(newMessage(payload));
        //         this.messages!.push(payload);
        //     }

        //     // send edited message to all connections
        //     if (message.type === "edit") {
        //         this.party.broadcast(editMessage(payload), []);
        //         this.messages = this.messages!.map((m) =>
        //             m.id == message.id ? payload : m
        //         );
        //     }
        //     // persist the messages to storage
        //     await this.party.storage.put("messages", this.messages);

        //     // automatically clear the room storage after period of inactivity
        //     await this.party.storage.deleteAlarm();
        //     await this.party.storage.setAlarm(
        //         new Date().getTime() + DELETE_MESSAGES_AFTER_INACTIVITY_PERIOD
        //     );
        // }
    }

    async onClose(connection: Party.Connection) {
        this.updateRoomList("leave", connection);
    }

    /**
     * A scheduled job that executes when the room storage alarm is triggered
     */
    async onAlarm() {
        // alarms don't have access to room id, so retrieve it from storage
        const id = await this.bunker.storage.get<string>("id");
        if (id) {
            await this.removeRoomMessages();
            await this.removeRoomFromRoomList(id);
        }
    }
}

BunkerServer satisfies Party.Worker;