const { program } = require('commander');
const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');

const multer = require('multer');
const upload = multer();

app.use(express.json());
app.use(express.text());

//CMD PARSER ---
program.requiredOption('-h, --host <host>')
program.requiredOption('-p, --port <port>')
program.requiredOption('-c, --cache <cache>');
program.parse();
const options = program.opts();

const host = options.host;
const port = options.port;
const cache = options.cache;

//SERVER ---
app.get('/notes/:name',async (req,res) => {
    const noteName = req.params.name; 
 
    const notesJson = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notesObj = JSON.parse(notesJson); 

    for (const noteItem of notesObj) {
        if (noteItem.name === noteName) {
            res.status(200).send(noteItem.text);
            return
        }
    }
    res.status(404).send(); 
});
app.get('/notes', async(req,res)=>{
    const notesJson = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notesObj = JSON.parse(notesJson); 
    res.status(200).json(notesObj)
});

app.put('/notes/:name', async (req, res) => {
    const noteName = req.params.name;
    const bodyText = req.body; 

    const notesJson = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notesObj = JSON.parse(notesJson); 

    for (let noteItem of notesObj) {
        if (noteItem.name === noteName) {
            noteItem.text = bodyText; 
            await fs.promises.writeFile(`${cache}/notes.json`, JSON.stringify(notesObj, null, 2));
            return res.status(200).send(); 
        }
    }
    res.status(404).send(); 
});

app.delete('/notes/:name',async(req,res)=>{
    const noteName = req.params.name;

    const notesJson = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notesObj = JSON.parse(notesJson); 

    for (let noteItem of notesObj) {
        if (noteItem.name === noteName) {
            noteIndex = notesObj.indexOf(noteItem);
            notesObj.splice(noteIndex,1)
            await fs.promises.writeFile(`${cache}/notes.json`, JSON.stringify(notesObj, null, 2));
            return res.status(200).send(); 
        }
    }
    res.status(404).send(); 
});
app.post('/write', upload.none(), async (req, res) => {
    const note_name = req.body.note_name
    const note  = req.body.note;

    if (!note_name) {
        return res.status(400).send('You did not write name');
    }else if (!note){
        return res.status(400).send('You did not write text');
    }

    const notesJson = await fs.promises.readFile(`${cache}/notes.json`, 'utf8'); 
    const notesObj = JSON.parse(notesJson); 
    for (let noteItem of notesObj) {
        if (noteItem.name === note_name) {
            return res.status(400).send();
        }
    }

    notesObj.push({ name: note_name, text: note });
    await fs.promises.writeFile(`${cache}/notes.json`, JSON.stringify(notesObj, null, 2));

    res.status(201).send();
});
app.get('/UploadForm.html', async (req,res)=>{
    res.sendFile(path.join(__dirname,'UploadForm.html'))
});

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});