const express = require('express');
const router = express.Router();
const fs = require('fs');

// Handle GET requests to the "/guestbook" path
router.get('/guestbook', (req, res) => {
  fs.readFile('messages.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error reading messages file');
      return;
    }

    const messages = JSON.parse(data);
    res.render('guestbook', { messages: messages });
  });
});

// Handle GET requests to the "/newmessage" path
router.get('/newmessage', (req, res) => {
  res.render('newmessage');
});

// Handle POST requests to the "/newmessage" path
router.post('/newmessage', (req, res) => {
  const name = req.body.name;
  const country = req.body.country;
  const message = req.body.message;

  // Validate that all fields are filled out
  if (!name || !country || !message) {
    res.status(400).send('All fields are required');
    return;
  }

  fs.readFile('messages.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error reading messages file');
      return;
    }

    const messages = JSON.parse(data);
    const id = messages.length + 1; // Generate a new ID
    const newMessage = {
      id: id,
      name: name,
      country: country,
      message: message,
      date: getCurrentTime()
    };
    messages.push(newMessage);

    fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error writing to messages file');
        return;
      }

      res.redirect('/guestbook');
    });
  });
});


module.exports = router;
