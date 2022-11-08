import { Server, Socket } from "socket.io";
import type { NextApiRequest } from "next";
import { Schedule } from "../../types/Schedule";
import { User } from "../../types/User";
import { Accountancy } from "../../types/Accountancy";
import { DonateItem } from "../../types/DonateItem";
import { TchatMsgWithUserData } from "../../types/Tchat";

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket: Socket) => {
    dataHandler(io, socket);
  };

  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}
const dataHandler = (io: any, socket: Socket) => {
  const handleReminder = (reminder: Schedule) => {
    socket.broadcast.emit("handleReminder", reminder);
  };
  const handleUser = (user: User) => {
    socket.broadcast.emit("handleUser", user);
  };
  const handleAccountancy = (accountancy: Accountancy) => {
    socket.broadcast.emit("handleAccountancy", accountancy)
  };
  const handleProduct = (product: DonateItem) => {
    socket.broadcast.emit("handleProduct", product);
  };
  const handleTchatMsg = (tchat: TchatMsgWithUserData) => {
    socket.broadcast.emit("handleTchatMsg", tchat);
  };

  socket.on("clientSideReminder", handleReminder);
  socket.on("clientSideUser", handleUser);
  socket.on("clientSideAccountancy", handleAccountancy);
  socket.on("clientSideProduct", handleProduct);
  socket.on("clientSideTchatMsg", handleTchatMsg);

};