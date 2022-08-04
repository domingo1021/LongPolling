const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const maxTimeout = 5;
let fakeData = []

app.get("/data", async (req, res)=>{
    let timeout = 0;
    let previousData = [...fakeData]
    let promiseData = await new Promise((resolve, reject)=>{
        let interval = setInterval(()=>{
            console.log(timeout)
            if(timeout >= maxTimeout){
                clearInterval(interval);
                resolve(fakeData);
            }
            console.log(fakeData, previousData)
            let hasChange = fakeData.some((element, index)=>{
                return element !== fakeData[index]
            })
            if(hasChange || fakeData.length !== previousData.length){
                clearInterval(interval);
                resolve(fakeData)
            }
            timeout += 1;
        },1000)
    })
    console.log("out")
    if(promiseData.length === 0){
        return res.status(200).json({data: null});
    }
    return res.status(200).json({data: promiseData})

})

app.post("/data", (req, res)=>{
    let {data} = req.body;
    fakeData.push(data)
    const inboundIP = req.header('x-forwarded-for') || req.socket.remoteAddress;
    return res.send(`${inboundIP} says ${data}`);
})

// 發現奇特的點： RESTful 設計下的 delete 會等到 get 結束才會執行
app.delete("/Deletedata", (req, res)=>{
    fakeData = [];
    console.log("in")
    return res.send("Deleted")
})

app.listen(3001, ()=>{
    console.log("Connecting to port 3001")
})