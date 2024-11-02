const { program } = require('commander');
const express = require('express')
const app = express()

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
app.get('/',(req,res) => {
    res.send("Hello");
})


app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});