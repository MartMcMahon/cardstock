function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let username = uuidv4();
document.getElementById("username").value = username;
fetch(`http://localhost:8080/id/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: username }),
}).then((res) => {
  console.log("res", res);
});

const read = async () => {
  return fetch("http://localhost:8080/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    console.log("post res", res);
    return res;
  });
};

const send = (params) => {
  console.log("called send with ", params);
  let d = fetch("http://localhost:8080", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: params,
  }).then((res) => {
    return res.body;
  });

  // incoming.splice(0, 0, d);
  return "send returning";
};

let indata = "";
let outdata = "";
export const outgoing = (s) => {
  outdata = s;
  return null;
};

export const incoming = () => {
  let i = indata;
  indata = null
  return i;
};

setInterval(() => {
  if (outdata) {
    send(outdata);
    outgoing = null;
  }
}, 200);

setInterval(() => {
  if (indata === null) {
    let s = read();
    indata = s;
  }
}, 200);
