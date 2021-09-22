import io from "socket.io-client";

class SocketService {
  socket = null;
  constructor() {
    this.socket = io("http://localhost:4000");
  }
}

export default new SocketService();
