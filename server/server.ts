// import { createServer } from "http";
import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import Document from "./schemas/Document";

const DEFAULT_DOCUMENT_VALUE = "";

mongoose.connect("mongodb://localhost/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("get-document", async (docId: string) => {
    // joins a specific room based on id
    const document = await findOrCreateDocument(docId);
    socket.join(docId);

    //@ts-ignore
    socket.emit("load-document", document.data);

    // sends document changes to that room
    socket.on("send-changes", (delta) => {
      // console.log(delta);
      socket.broadcast.to(docId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(docId, { data });
    });
  });

  console.log("connected!");
});

async function findOrCreateDocument(id: string) {
  if (id === null) return;
  const document = await Document.findById(id);

  if (document) {
    return document;
  }
  return Document.create({ _id: id, data: DEFAULT_DOCUMENT_VALUE });
}
