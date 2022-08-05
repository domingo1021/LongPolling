$(document).ready(async function(){
    while(true){
        let start = Date.now();
        let response = await axios.get("/data");
        let end = Date.now();
        if(response.data.data === null){
            console.log((end-start)/1000, response.data.data)
            $("#messages").text("null")
        }else{
            console.log((end-start)/1000)
            $("#messages").text("");
            for(let i =0; i<response.data.data.length; i++){
                let messageElem = document.createElement('div');
                messageElem.textContent = response.data.data[i];
                document.getElementById('messages').prepend(messageElem);
            }
        }
    }
})

$("#submit-btn").click(async function(){
    console.log("submit clicked")
    let inputText = $("#input-text").val(); 
    try {
        await axios({
            method: "post",
                url: "/data",
                data: {"data":inputText},
        })
    } catch (error) {
        $("#messages").text("錯誤產生")
    }
})

$("#clear-btn").click(async function(){
    console.log("clear clicked")
    try {
        // await axios.delete("/data")
        await axios.delete("/Deletedata")
        $("#messages").text("")
    } catch (error) {
        $("#messages").text("錯誤產生")
    }
})