const fs = require('fs')
const express = require('express')
const EventEmitter = require('events')

const chatEmitter = new EventEmitter()
const port = process.env.PORT || 1337

const app = express()

app.get('/', mainPage)
app.get('/static/*', mainStatic)
app.get('/chat', mainChat)
app.use('/sse', mainSSE)
app.use('*.js', (req, res, next) => {
    res.set('Content-Type', 'text/javascript')
    next();
})

app.listen(port, () => console.log(`server on ${port}`))


function mainPage(req, res) {
    res.setHeader('content-Type', 'text/plain')
    res.end('hiisadi')
}

function mainStatic (req, res) {
    const filename = `${__dirname}/public/${req.params[0]}`
    console.log(filename);
    fs.createReadStream(filename)
        .on('error', () => mainError(req, res))
        .pipe(res)
}

function mainChat (req, res) {
    const { message } = req.query
    chatEmitter.emit('message', message)
    res.end()
}
// chat.js side connection
function mainSSE (req, res) {
    res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
    })

    const onMessage = msg => res.write(`data: ${msg}\n\n`)
    chatEmitter.on('message', onMessage)

    res.on('close', function () {
        chatEmitter.off('message', onMessage)
    })
}
// error side
function mainError (req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
}
