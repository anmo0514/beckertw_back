// 連結到資料庫
const db = require(__dirname + "../../modules/mysql-connect");
const { toDateString, toDatetimeString } = require(__dirname +
    "../../modules/date-tools");


class OrderList {
    // `orderId`, `member_id`, `adults`, `kids`, `totalPrice`, `	room_id`, `room_type_id`, `	room_folder`, `room_image`, `room_name`, `start_date`, `end_date`, `created_at`, （資料庫所有欄位都要對上，不可多，不可少 ）
    constructor(data) {
        // data: Object
        let defaultData = {
            order_id: 0,
            member_id: 0,
            adults: 0,
            kids: '',
            totalPrice: ' ',
            room_id: '',
            room_type_id: '',
            room_folder: '',
            room_image: '',
            room_name: '',
            start_date: '',
            end_date: '',
            created_at: '1970-01-01'
        };
        this.data = {...defaultData, ...data}; // 預設的值先解開來，後面的設定的會蓋掉前面的 
    }

    // 讀取單筆
    static async getOrderById(orderId){
        if(!orderId) return null;
        // let sql = 'SELECT * FROM `orders_p` WHERE `orderId`=?';
        // let sql = 'SELECT * FROM `order_pitems` INNER JOIN `orders_p` ON `order_pitems`.`orderId` =  `orders_p`.`orderId` WHERE `order_pitems`.`orderId`=?';
        let sql = 'SELECT * FROM `order_detail` WHERE `order_id`=?';
        let [r] = await db.query(sql, [orderId]);
        for (let i = 0; i < r.length; i++) {
            r[i].start_date = toDateString(r[i].start_date);
            r[i].end_date = toDateString(r[i].end_date);
        }
        if(!r || !r.length){
            return null;
        }
        return r;
    }



}

module.exports = OrderList