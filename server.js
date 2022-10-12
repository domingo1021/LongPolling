const express = require('express');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const app = express();

app.use(express.static('public'));
app.use(express.json());

let fakeData = []

app.get("/data", async (req, res)=>{
    await new Promise((resolve, reject)=>{
        let timeout = setTimeout(()=>{
            console.log("has wait for 5 sec, no data changed")
            resolve()
        }, 5000)
        eventEmitter.on('Data change', ()=>{
            clearTimeout(timeout);
            resolve()
        })
    })
    console.log("out")
    if(fakeData.length === 0){
        return res.status(200).json({data: null});
    }
    return res.status(200).json({data: fakeData})

})

app.post("/data", (req, res)=>{
    let {data} = req.body;
    if(fakeData === null){
        fakeData = [];
    }
    fakeData.push(data)
    const inboundIP = req.header('x-forwarded-for') || req.socket.remoteAddress;
    eventEmitter.emit("Data change")
    return res.send(`${inboundIP} says ${data}`);
})

app.delete("/Deletedata", (req, res)=>{
    fakeData = [];
    eventEmitter.emit("Data change")
    return res.send("Deleted")
})

app.listen(3001, ()=>{
    console.log("Connecting to port 3001")
})