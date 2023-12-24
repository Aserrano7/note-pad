const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) return console.log(err);
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) return console.log(err);

    const notes = JSON.parse(data);
    let newId;
    if (notes.length > 0) {
      newId = notes[notes.length - 1].id + 1;
    } else {
      newId = 10;
    }
    
    const newNote = { title, text, id: newId };
    const updatedNotes = [...notes, newNote];

    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(updatedNotes), (err) => {
      if (err) return console.log(err);
      res.json(updatedNotes);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const deleteId = JSON.parse(req.params.id);
  
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) return console.log(err);

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== deleteId);

    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes), (err) => {
      if (err) return console.log(err);
      res.json(notes);
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`)
});
