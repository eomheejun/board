const express = require('express');
const { create } = require('../../models/board');
const board = require('../../models/board');
const router = express.Router();
const boardmodel = require("../../models/board");

//main
router.get('/', (req,res)=>{
    boardmodel.find(function(err,board){
        if(err){
            console.log("error")
        }else{
            let id_list = [];
            let title_list = [];
            let name_list = [];
            let text_list = [];
            let date_list =[];
            let page_num = parseInt(board.length/5);
            if(board.length>= 5 && board.length%5== 0){
                page_num = page_num
            }else{
                page_num = page_num +1
            }


            for(let i=(board.length-5);i<board.length;i++)
            {
                id_list.push(board[i].id)
                title_list.push(board[i].title)
                name_list.push(board[i].name)
                text_list.push(board[i].text)
                date_list.push(board[i].createTime)
            }

            res.render('main', {id:id_list.reverse(),title:title_list.reverse(), 
                name:name_list.reverse(), text:text_list.reverse(),
                date:date_list.reverse(),
                page_num:page_num
            })
        }
    })
})

router.get('/page/:num', (req,res)=>{
    let num=req.params.num
    if(num == '1'){
        boardmodel.find(function(err,board){
            if(err){
                console.log("error")
            }else{
                let id_list = [];
                let title_list = [];
                let name_list = [];
                let text_list = [];
                let date_list =[];
                let page_num = parseInt(board.length/5);
                if(board.length>= 5 && board.length%5== 0){
                    page_num = page_num
                }else{
                    page_num = page_num +1
                }
                for(let i=(board.length-5);i<board.length;i++)
                {
                    id_list.push(board[i].id)
                    title_list.push(board[i].title)
                    name_list.push(board[i].name)
                    text_list.push(board[i].text)
                    date_list.push(board[i].createTime)
                }
    
                res.render('main', {id:id_list.reverse(),title:title_list.reverse(), 
                    name:name_list.reverse(), text:text_list.reverse(),
                    date:date_list.reverse(),
                    page_num:page_num
                })
            }
        })
    }else{
        boardmodel.find(function(err,board){
            if(err){
                console.log("error")
            }else{
                let id_list = [];
                let title_list = [];
                let name_list = [];
                let text_list = [];
                let date_list =[];
                let page_num = parseInt(board.length/5);
                if(board.length>= 5 && board.length%5== 0){
                    page_num = page_num
                }else{
                    page_num = page_num +1
                }
                let start = ((board.length-5) -((num-1)*5));
                let end = start+5;
                if(start<0){
                    start=0                    
                }
                for(let i=start ;i<end;i++)
                {
                    id_list.push(board[i].id)
                    title_list.push(board[i].title)
                    name_list.push(board[i].name)
                    text_list.push(board[i].text)
                    date_list.push(board[i].createTime)
                }
                res.render('main', {id:id_list.reverse(),title:title_list.reverse(), 
                    name:name_list.reverse(), text:text_list.reverse(),
                    date:date_list.reverse(),
                    page_num:page_num
                })
            }
        })
    }

})

function Now() {

    var date = new Date();
    var aaaa = date.getUTCFullYear();
    var gg = date.getUTCDate();
    var mm = (date.getUTCMonth() + 1);

    if (gg < 10)
        gg = "0" + gg;
    if (mm < 10)
        mm = "0" + mm;

    var cur_day = aaaa + "-" + mm + "-" + gg;

    var hours = date.getUTCHours()+9
    var minutes = date.getUTCMinutes()
    var seconds = date.getUTCSeconds();

    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;
    return cur_day + " " + hours + ":" + minutes + ":" + seconds;

}

//create

router.get('/create', (req, res)=>{
    boardmodel.find(function(err,board){
        if(err){
            console.log("error")
        }else{
            res.render('create',{id:board.length+1})
        }    
    })
})

router.post('/create', (req,res)=> {
    boardmodel
        .findOne({title: req.body.title})
        .then(board => {
            let date= Now()
            const newBoard = new Board({
                id:req.body.id,
                title:req.body.title,
                name:req.body.name,
                text:req.body.text,
                createTime:date
            })
            newBoard.save()
            .then(res.redirect("/"))
            .catch(err => console.log(err));
        })
        .catch(err=>res.json(err));
});
//read
router.get('/main/:id', (req, res) => {
    boardmodel
        .findOne({id:req.params.id})
        .then(board => {
            if(req.params.id=='D'){
                res.send(`
                <script>
                var contest = alert("삭제 된 글입니다.")
                if(contest === true){
                    history.back();
                }
                else{
                    history.back();
                }
                </script>
                `
                );
            }else{

                let title=board.title;
                let name=board.name;
                let text=board.text;
                let date=board.createTime;
                let id=board.id;
                res.render('board',{id:id,text:text, title:title,name:name,date:date})
            }

        })
        .catch(err=>res.json(err));
})
//update
router.get('/update/:id' ,(req, res)=>{
    boardmodel
        .findOne({id:req.params.id})
        .then(board => {
            console.log(board)
            res.render("update", {id:board.id,title:board.title,name:board.name,text:board.text})
        })
        .catch(err=>res.json(err));
})
router.post('/update/:id' , (req, res) => {
    const id = req.params.id;
    let date = Now();
    boardmodel
        .updateMany({id:id}, {$set:{
            id:req.body.id,
            title:req.body.title,
            name:req.body.name,
            text:req.body.text,
            createTime:date
        }})
        .exec()
        .then(result => {
            res.redirect("/")
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

//delete
router.get('/delete/:id' , (req, res) => {
    boardmodel
        .findOne({id:req.params.id})
        .then(board => {
            console.log(board)
            res.render("delete", {id:board.id,title:board.title,name:board.name,text:board.text})
        })
        .catch(err=>res.json(err));
});

router.post('/delete/:id' , (req, res) => {
    const id = req.params.id;
    const del = 'D';
    let date = Now();
    boardmodel
        .updateMany({id:id}, {$set:{
            id:del,
            createTime:date
        }})
        .exec()
        .then(result => {
            res.redirect("/")
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


module.exports = router;
