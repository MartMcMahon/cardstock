export class Connection {
  constructor() {
    this.isConnected = false;
    this.ws = new WebSocket("ws://localhost:9999");
    this.incoming = [];
    this.incoming_count = 0;

    // Connection opened
    this.ws.addEventListener("open", (event) => {
      this.isConnected = true;
      this.ws.send("Hello Server!");
      this.incoming = new Array();
    });

    // Listen for messages
    this.ws.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      this.incoming.push(event.data);
    });
  }

  send(msg) {
    console.log("sending ", msg, "from js");
    this.incoming_count = this.incoming.length;
    this.ws.send(msg);
  }

  next() {
    return this.incoming.pop();
  }


  // next() {
  //   this.has_timedout = false;
  //   let timeout = setTimeout(() => {
  //     this.has_timedout = true;
  //   }, 2000);
  //   while (true) {
  //     if (this.incoming.length > this.incoming_count) {
  //       clearTimeout(timeout);
  //       this.incoming_count = this.incoming.length;
  //       return this.incoming.pop();
  //     }
  //     if (this.has_timedout === true) {
  //       return "None";
  //     }
  //   }
  // }

  // next() {
  //   console.log("sending next from js to bevy");
  //   this.has_timedout = false;

  //   new Promise((resolve, reject) => {
  //     let timeout = setTimeout(()=>{
  //       this.has_timedout = true;
  //     }, 2500);
  //     while this
  //   if (this.incoming.length > 0) {
  //     return this.incoming.pop();

  //   }
  //   } else {
  //     return "None";
  //   }
  // }
}

let conn = new Connection();
// setTimeout(() => {
//   conn.send("test msg 1 from js");
//   conn.send("test msg 2 from js");
//   conn.send("test msg 3 from js");
// }, 1000);

export function send(msg) {
  if (conn.isConnected) {
    return conn.send(msg);
  } else {
    return "None";
  }
}

export function read() {
  return conn.next();
}
