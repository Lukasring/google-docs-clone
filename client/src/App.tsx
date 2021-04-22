import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 } from "uuid";
import TextEditor from "./components/TextEditor/TextEditor";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${v4()}`} />
        </Route>
      </Switch>
      <Route path="/documents/:docId">
        <TextEditor />
      </Route>
    </Router>
  );
}

export default App;
