import { User } from "@/bunkers-server/utils/auth";
import { json, notFound } from "@/bunkers-server/utils/response";
import type * as Party from "partykit/server";

/**
 * The bunkers party's purpose is to keep track of all bunkers, so we want
 * every client to connect to the same bunker instance by sharing the same room id.
 */
export const SINGLETON_ROOM_ID = "list";

/** Bunkers sends an update when participants join/leave */
export type BunkerInfoUpdateRequest = {
    id: string;
    connections: number;
    action: "enter" | "leave";
    user?: User;
};

/** Bunkers notifies us when it's deleted  */
export type BunkerDeleteRequest = {
    id: string;
    action: "delete";
};

/** Bunkers sends us information about connections and users */
export type BunkerInfo = {
    id: string;
    connections: number;
    users: {
        username: string;
        joinedAt: string;
        leftAt?: string;
        present: boolean;
        image?: string;
    }[];
};

export default class BunkersServer implements Party.Server {
    options: Party.ServerOptions = {
        hibernate: true,
        // this opts the chat room into hibernation mode, which
        // allows for a higher number of concurrent connections
    };

    constructor(public party: Party.Room) { }

    async onConnect(connection: Party.Connection) {
        // when a websocket connection is established, send them a list of bunkers
        connection.send(JSON.stringify(await this.getActiveBunkers()));
    }

    async onRequest(req: Party.Request) {
        // we only allow one instance of chatRooms party
        if (this.party.id !== SINGLETON_ROOM_ID) return notFound();

        // Clients fetch list of bunkers for server rendering pages via HTTP GET
        if (req.method === "GET") return json(await this.getActiveBunkers());

        // Bunkers report their connections via HTTP POST
        // update bunker info and notify all connected clients
        if (req.method === "POST") {
            const roomList = await this.updateBunkerInfo(req);
            this.party.broadcast(JSON.stringify(roomList));
            return json(roomList);
        }

        // admin api for clearing all bunkers (not used in UI)
        if (req.method === "DELETE") {
            await this.party.storage.deleteAll();
            return json({ message: "All room history cleared" });
        }

        return notFound();
    }
    /** Fetches list of active bunkers */
    async getActiveBunkers(): Promise<BunkerInfo[]> {
        const rooms = await this.party.storage.list<BunkerInfo>();
        return [...rooms.values()];
    }
    /** Updates list of active bunkers with information received from bunker */
    async updateBunkerInfo(req: Party.Request) {
        const update = (await req.json()) as
            | BunkerInfoUpdateRequest
            | BunkerDeleteRequest;

        if (update.action === "delete") {
            await this.party.storage.delete(update.id);
            return this.getActiveBunkers();
        }

        const persistedInfo = await this.party.storage.get<BunkerInfo>(update.id);
        if (!persistedInfo && update.action === "leave") {
            return this.getActiveBunkers();
        }

        const info = persistedInfo ?? {
            id: update.id,
            connections: 0,
            users: [],
        };

        info.connections = update.connections;

        const user = update.user;
        if (user) {
            if (update.action === "enter") {
                // bump user to the top of the list on entry
                info.users = info.users.filter((u) => u.username !== user.username);
                info.users.unshift({
                    username: user.username,
                    image: user.image,
                    joinedAt: new Date().toISOString(),
                    present: true,
                });
            } else {
                info.users = info.users.map((u) =>
                    u.username === user.username
                        ? { ...u, present: false, leftAt: new Date().toISOString() }
                        : u
                );
            }
        }

        await this.party.storage.put(update.id, info);
        return this.getActiveBunkers();
    }
}