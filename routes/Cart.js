const express = require("express");
// 連結到資料庫
const db = require(__dirname + "../../modules/mysql-connect");
// 設定路由
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const OrderList = require(__dirname + '/../modules/OrderList');

//extended： 使用 qs 進行解析，若為 false，則採用 querystring 進行解析，預設為 true
router.use(bodyParser.urlencoded({ extended: false }));
// cors 允許跨領域傳輸資料
router.use(cors());
// 轉議json 資料
router.use(express.json());

//=================nodeamiler
//send email
function sendEmail(email1) {
    var email1 = "shinderr0125@gmail.com";

    var mail = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "shinderr0125@gmail.com",
            pass: "zzukvqfcndhvbcrh",
        },
    });

    var mailOptions = {
        from: "shinderr0125@gmail.com",
        to: email1,
        subject: "shuyoung舒營 訂單編號",
        html: `<h1>感謝預訂</h1>`,
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("flase");
        } else {
            console.log("success");
        }
    });
}

//================nodemailer

router.post("/orderDetail-email", async (req, res, next) => {
    var email = "shinderr0125@gmail.com";

    var order_id = req.body.order_id;

    console.log(email);

        res.json({
            success: true,
            message: "驗證成功，正在寄送電子郵件...",
            code: "200",
        });

        var sent = sendEmail(email, order_id);

        if (sent != "0") {
            console.log("信件已成功寄出");
        }
});

//CRUD
//將商品加入購物車
router.post('/order/add', async(req,res)=>{
    const userId = await req.params.userId;

    console.log(userId);
    let output ={
        success: false,
        error:'',
        insertId: 0,
    };
    
    if(!req.body.orderItems.room_id > 1){
        output.error = '參數不足'
        return  res.json(output);
    }

    if( +req.body.quantity <1 ){
        output.error = '數量不能小於1';
        return  res.json(output);
    }
     //判斷該商品是否加入購物車
    const sql3 = `SELECT COUNT(1) num FROM room_reservation WHERE room_id=?`;
    const [[{num}]] = await db.query(sql3, [req.body.orderItems.room_id]);
    if(num>0){
        output.error = '購物車內已經有這個商品'
        return  res.json(output);
    }

    for (let item of req.body.orderItems){
        const sql2 = "INSERT INTO `room_reservation` SET ?";
        const [r2] = await db.query(sql2, [item]);
        console.log(req.body)
    }

    output = {...output, body: req.body.orderItems};
    res.json(output);
});

//寫入信用卡資訊
router.post('/card/add', async(req,res)=>{
    let output ={
        success: false,
        error:'',
        insertId: 0,
    };
    console.log(req.body)
    const member = req.body.member_id;
    const number = req.body.card_number;
    const date = req.body.expire_date;

    const creditCardsql = "INSERT INTO `credit_card`(`m_id`, `card_number`, `expire_date`) VALUES( ?, ?, ?) ";

    const [r3] = await db.query(creditCardsql, [member, number, date]);

    if(r3.affectedRows){
        output.success = true;
    }
    res.json(output); 
});

//寫入訂單資訊
router.post('/orderDetail/add', async(req,res)=>{
    let output ={
        success: false,
        error:'',
        insertId: 0,
    };
    console.log(req.body.orderDetail)

    for (let item of req.body.orderDetail){
        const sql3 = "INSERT INTO `order_detail` SET ?";
        const [r3] = await db.query(sql3, [item]);
        console.log(req.body.orderDetail)
    }

    output = {...output, body: req.body.orderDetail};
    res.json(output);
});

//取得訂單內容
router.get('/:orderId', async (req, res)=>{

    let p = await OrderList.getOrderById(req.params.orderId)

    res.json(p);
});

//取得Coupn
router.get('/coupn', async (req, res)=>{
    const coupnId = await req.params.coupnId;

    let output ={
        success: false,
        error:'',
        insertId: 0,
    };

    console.log(coupnId);

    const coupnsql = "SELECT * FROM `coupon` WHERE `discount_number` = '?'";

    const [r4] = await db.query( coupnsql, [coupnId]);


    res.send(output); 
});

// router 一定要回傳module
module.exports = router;
