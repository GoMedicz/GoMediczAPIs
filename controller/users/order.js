// const { Order } = require("../../models/users");
// const bcrypt = require("bcrypt");
// const { Auth } = require("../../middlewares/auth");
// const { Utils } = require("../../middlewares/utils");
// const _ = require("lodash");

// const utils = new Utils();
// const auth = new Auth();


// const createOrder = async (req, res)=>{
//     try {
//             const orderData = req.body; // The order data should be sent in the request body

//             const order = await Order.create(orderData);

//             return res.json({ success: true, message: 'Order created successfully', order });
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: "unable to create order",
//             error: utils.getMessage("UNKNOWN_ERROR"),
//           });
//     }
// }