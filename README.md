# GOOGLE DOCS CLONE

### Created with

- React for frontend
- Quill for content editing
- socket.io conects front end with database
- MongoDB for storage

### How it works

Homepage redirects to document with random id. You can write and edit contents on the page. If another user is editing the same document you can see the changes realtime. Document content is saved to database every 2 seconds.

To **start** this project you need MongoDB installed on your computer locally. Then navigate to _client_ and install dependancies **npm install** and start the app **npm start**. Runs on port _3000_.
To start the server, navigate to _server_ directory, install required dependancies **npm start** and run server **npm run devStart**. Server runs on port _3001_
