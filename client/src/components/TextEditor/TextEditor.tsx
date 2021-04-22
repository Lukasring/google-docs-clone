import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Quill, { Sources } from "quill";

import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ allign: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const SAVE_INTERVAL_MS = 2000;

export default function TextEditor() {
  const { docId } = useParams<{ docId: string }>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [quill, setQuill] = useState<Quill>();

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  //save document to db on interval
  useEffect(() => {
    if (socket === null || quill === null) {
      return;
    }

    const interval = setInterval(() => {
      socket?.emit("save-document", quill?.getContents());
    }, SAVE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) {
      return;
    }
    socket?.once("load-document", (document: any) => {
      quill?.setContents(document);
      quill?.enable();
    });

    socket?.emit("get-document", docId);
    return () => {
      //
    };
  }, [socket, quill, docId]);

  useEffect(() => {
    // recieve document changes from server
    if (socket === null || quill === null) {
      return;
    }
    console.log("quill changes use effect");
    const recievedChangesHandler = (delta: any) => {
      quill?.updateContents(delta);
    };
    socket?.on("receive-changes", recievedChangesHandler);

    return () => {
      socket?.off("receive-changes", recievedChangesHandler);
    };
  }, [socket, quill]);

  useEffect(() => {
    // sends document changes to server
    if (socket === null || quill === null) {
      return;
    }
    console.log("quill changes use effect");
    const quillChangeHandler = (delta: any, oldDelta: any, source: Sources) => {
      if (source !== "user") {
        return;
      }
      socket?.emit("send-changes", delta);
    };

    quill?.on("text-change", quillChangeHandler);
    return () => {
      quill?.off("text-change", quillChangeHandler);
    };
  }, [socket, quill]);

  useEffect(() => {
    // connects to server
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}
