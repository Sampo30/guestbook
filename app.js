// app.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Load messages from messages.json file
let messages = JSON.parse(fs.readFileSync('messages.json'));


app.get('/', function(req, res) {
  res.render('homepage');
});


app.get('/guestbook', (req, res) => {
  res.render('guestbook', { messages: messages });
});

app.get('/newmessage', (req, res) => {
  res.render('newmessage');
});

app.get('/ajaxmessage', (req, res) => {
  res.render('ajaxmessage', { messages: messages });
});


app.post('/newmessage', (req, res) => {
  const { name, country, message } = req.body;

  // Check that all fields are non-empty
  if (!name || !country || !message) {
    return res.status(400).send('All fields are required.');
  }

  // Create new message object
  const newMessage = {
    id: uuidv4(),
    name: name,
    country: country,
    message: message,
  };

  // Add new message to messages array
  messages.push(newMessage);

  // Save updated messages to messages.json file
  fs.writeFileSync('messages.json', JSON.stringify(messages));

  res.redirect('/guestbook');
});

app.post('/ajaxmessage', (req, res) => {
  const { username, country, message } = req.body;

  // Check that all fields are non-empty
  if (!username || !country || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Create new message object
  const newMessage = {
    id: uuidv4(),
    username: username,
    country: country,
    message: message,
    date: new Date().toLocaleString(),
  };

  // Add new message to messages array
  messages.push(newMessage);

  // Save updated messages to messages.json file
  fs.writeFileSync('messages.json', JSON.stringify(messages));

  // Return updated messages array as JSON
  res.json({ messages: messages });
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
