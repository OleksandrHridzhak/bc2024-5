const { program } = require('commander');
const express = require('express')
const app = express()
const fs = require('fs');

//CMD PARSER ---
program.requiredOption('-h, --host <host>')
program.requiredOption('-p, --port <port>')
program.requiredOption('-c, --cache <cache>');
program.parse();
const options = program.opts();

const host = options.host;
const port = options.port;
const cache = options.cache;
app.use(express.json());
app.use(express.text());
//SERVER ---
app.get('/notes/:name',async (req,res) => {
    const noteName = req.params.name; 
 
    const data = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notes = JSON.parse(data); 
    let note; 

    for (const noteItem of notes) {
        if (noteItem.name === noteName) {
            note = noteItem; 
            break;
        }
    }

    if (note) {
        res.status(200).send(note.text); 
    } else {
        res.status(404); 
    }
  
})
app.get('/notes', async(req,res)=>{
    const data = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notes = JSON.parse(data)
    res.status(200).json(notes)
});

app.put('/notes/:name', async (req, res) => {
    const noteName = req.params.name;
    const bodyText = req.body; 

    const data = await fs.promises.readFile(`${cache}/notes.json`, 'utf8');
    const notes = JSON.parse(data);

    for (let noteItem of notes) {
        if (noteItem.name === noteName) {
            noteItem.text = bodyText; 
            await fs.promises.writeFile(`${cache}/notes.json`, JSON.stringify(notes, null, 2));
            return res.status(200).send(); 
        }
    }
    res.status(404).send(); 
});

app.delete('/notes/:name',async(req,res)=>{
    const noteName = req.params.name;

    const data = await fs.promises.readFile(`${cache}/notes.json`, 'utf8');
    const notes = JSON.parse(data);

    for (let noteItem of notes) {
        if (noteItem.name === noteName) {
            noteIndex = notes.indexOf(noteItem);
            notes.splice(noteIndex,1)
            await fs.promises.writeFile(`${cache}/notes.json`, JSON.stringify(notes, null, 2));
            return res.status(200).send(); 
        }
    }
    res.status(404).send(); 
});


app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});