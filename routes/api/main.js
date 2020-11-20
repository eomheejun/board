const express = require('express');
const { create, db } = require('../../models/board');
const board = require('../../models/board');
const router = express.Router();
const boardmodel = require("../../models/board");

//main페이지
router.get('/', (req,res)=>{
    boardmodel.find(function(err,board){
        if(err){
            console.log("error")
        }else{
            let page_num = parseInt(board.length/5);
            if(board.length>= 5 && board.length%5== 0){
                page_num = page_num
            }else{
                page_num = page_num +1
            }
            let start;
            if(board.length-5<0){
                start = 0
            }else{
                start = board.length-5
            }
            res.render('main', {board:board.slice(start,board.length).reverse(),page_num:page_num})
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
                let page_num = parseInt(board.length/5);
                if(board.length>= 5 && board.length%5== 0){
                    page_num = page_num
                }else{
                    page_num = page_num +1
                }
                let start;
                if(board.length-5<0){
                    start = 0
                }else{
                    start = board.length-5
                }
                res.render('main', {board:board.slice(start,board.length).reverse(),page_num:page_num})
            }
        })
    }else{
        boardmodel.find(function(err,board){
            if(err){
                console.log("error")
            }else{

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
                res.render('main', {board:board.slice(start,end).reverse()
                ,page_num:page_num})
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
                res.render('board',{board:board})
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
            res.render("update", {board:board})
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
            updateTime:date
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
            res.render("delete", {board:board})
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
            deleteTime:date
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

//search 
//find에 조건을 걸어서 만족하는 board만 뽑음

router.post('/search', (req, res) => {
    const search = req.body.search;
    const text = req.body.text;
    if(search=="name" && text){
        boardmodel.find({"name":{ $regex: text }},function(err,board){
            if(err){
                console.log("error")
            }else{
                res.render('search', {board:board.reverse()})            
            }
        })
    }else if(search=="title" && text ){
        boardmodel.find({"title":{ $regex: text }},function(err,board){
            if(err){
                console.log("error")
            }else{
  

    
                res.render('search', {board:board.reverse()})            
            }
        })        
    }else if(!text && search == "--선택--"){
        res.redirect('/')
    }else{
        res.send(`
        <script>
        var contest = alert("검색어를 입력해주세요.")
        if(contest === true){
            history.back();
        }
        else{
            history.back();
        }
        </script>
        `
        );    
    }
})


module.exports = router;
