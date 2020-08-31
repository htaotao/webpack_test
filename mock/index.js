const express = require("express");

const app = express();

// 接口
app.get('/api/info', (req,res)=>{
    res.json({
        msg: 'hahah'
    })
})

app.listen("9092")