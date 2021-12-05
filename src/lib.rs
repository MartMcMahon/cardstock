pub mod network {

    use laminar::{ErrorKind, Packet, Socket, SocketEvent};
    use std::io::{stdin, BufRead, Error};
    use std::thread;
    use std::time::Instant;

    pub const SERVER: &str = "127.0.0.1:8000";

    pub fn server() -> Result<(), ErrorKind> {
        let mut socket = Socket::bind(SERVER)?;
        let (sender, receiver) = (socket.get_packet_sender(), socket.get_event_receiver());
        let _thread = thread::spawn(move || {
            socket.start_polling();
            println!("starting polling...")
        });

        loop {
            if let Ok(event) = receiver.recv() {
                match event {
                    SocketEvent::Packet(packet) => {
                        let msg = packet.payload();

                        if msg == b"Bye!" {
                            break;
                        }

                        let msg = String::from_utf8_lossy(msg);
                        let ip = packet.addr().ip();

                        println!("received {:?} from {:?}", msg, ip);

                        sender
                            .send(Packet::reliable_unordered(
                                packet.addr(),
                                "copy that".as_bytes().to_vec(),
                            ))
                            .expect("This should send");
                    }
                    SocketEvent::Timeout(address) => {
                        println!("client times out: {}", address);
                    }
                    _ => {}
                }
            }
        }

        Ok(())
    }

    pub fn client() -> Result<(), ErrorKind> {
        let addr = "127.0.0.1:8001";
        let mut socket = Socket::bind(addr)?;
        println!("connected on {}", addr);

        let server = SERVER.parse().unwrap();

        let stdin = stdin();
        let mut s_buffer = String::new();

        loop {
            s_buffer.clear();
            stdin.read_line(&mut s_buffer)?;
            let line = s_buffer.replace(|x| x == '\n' || x == '\r', "");

            socket.send(Packet::reliable_unordered(
                server,
                line.clone().into_bytes(),
            ))?;

            socket.manual_poll(Instant::now());

            if line == "Bye!" {
                break;
            }

            match socket.recv() {
                Some(SocketEvent::Packet(packet)) => {
                    if packet.addr() == server {
                        println!("server sent: {}", String::from_utf8_lossy(packet.payload()));
                    } else {
                        println!("unknown sender");
                    }
                }
                Some(SocketEvent::Timeout(_)) => {}
                _ => println!("silence.."),
            }
        }

        Ok(())
    }
}
