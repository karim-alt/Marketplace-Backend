const Order = require("../models/order.model");
const nodemailer = require("nodemailer");

let create_Order = (req, res) => {
  let order = new Order(req.body);
  order
    .save()
    .then((Order) => {
      res.status(200).json({ Order: "Order added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new Order failed :" + err);
    });
};
//sort({date: 'desc'})
let read_Orders = (req, res) => {
  Order.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
};

let update_Order = (req, res) => {
  Order.findById(req.params.id, (err, Order) => {
    if (!Order) res.status(404).send("Order not found");
    else {
      Order.status = true;
      Order.date = Date.now();
    }
    Order.save()
      .then((todo) => {
        res.json("Order updated!");
      })
      .catch((err) => {
        res.status(400).send("Update is not possible " + err);
      });
  });
};

let delete_Order = (req, res) => {
  Order.findByIdAndRemove(req.params.id, (err) => {
    if (err) return next(err);
    res.send("Order deleted successfully!");
  });
};

// mongoose “Find” with multiple conditions
let find_Oeder = (req, res) => {
  let id = req.params.id;
  id = new RegExp(`^${id}$`, "i");
  Order.find({ Client_Id: id }, (err, Order) => {
    if (err) {
      res.send("an error has occured " + err);
    } else if (Order.length) res.json(Order);
    else res.status(404).send("Order not found");
  });
};

let find_sellers_orders = (req, res) => {
  let Id = req.params.id;
  Order.find(
    {
      $or: [{ Seller_Id: Id }, { Buyer_Id: Id }],
    },
    (err, Order) => {
      if (err) {
        res.send("an error has occured " + err);
      } else if (!Order) res.status(404).send("Order not found");
      else res.json(Order);
    }
  ).sort({ _id: -1 });
};

let sendEmail = (req, res, next) => {
  const transMail = "kbrakani@gmail.com";
  const email = req.body.email;
  const message = req.body.message;
  const fullName = req.body.fullName;
  const productName = req.body.productName;
  const phone = req.body.phone;
  const qte = req.body.qte;
  const price = req.body.price;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kbrakani",
      pass: `Karim@1513606960`,
    },
  });
  let mailOptions = {
    from: transMail,
    to: email,
    subject: "Marketplace AgriEdge",
    html:
      `<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<style type="text/css">
body{background-color: #88BDBF;margin: 0px;}
</style>
<body>
	<table border="0" width="80%" style="margin:auto;padding:10px;background-color: #F3F3F3;border:1px solid #57B45A;">
		<tr>
			<td>
				<table border="0" width="100%">
					<tr>
						<td>
							<h1>AgriEdge</h1>
						</td>
						<td>
							<p style="text-align: right;"><a href="http://localhost:3000/app/orders" target="_blank" style="text-decoration: none;">View In Website</a></p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
					<tr>
						<td style="background-color:#57B45A;height:100px;font-size:50px;color:#fff;"><img src="https://img.icons8.com/dusk/64/000000/return-purchase.png"/></td>
					</tr>
					<tr>
						<td>
							<h1 style="padding-top:20px;">New Order</h1>
						</td>
					</tr>
					<tr>
						<td>
							<p style="padding:0px 20px;">
							` +
      message +
      `
							</p>
						</td>
					</tr>
					<tr>
						<td>
							<center><p style="padding:0px 100px;">
              <p><strong>Product Name :</strong> 	` +
      productName +
      `</p>
              <p><strong>Ordred quantity :</strong> 	` +
      qte +
      ` bag(s)</p>
              <p><strong>Price :</strong> 	` +
      price * qte +
      ` Dh</p>
              <p> <strong>Costumer Name :</strong> 	` +
      fullName +
      `</p>
              <p style="padding-bottom:20px;"><strong>Phone number :</strong>	` +
      phone +
      `</p>
							</p><center>
						</td>
					</tr>
					
				</table>
			</td>
		</tr>
		<tr>
			<td>
				<table border="0" width="100%" style="border-radius: 5px;text-align: center;">
					<tr>
						<td>
							<h3 style="margin-top:10px;">Stay in touch</h3>
						</td>
					</tr>
				
					<tr>
						<td>
							<div style="margin-top: 20px;">
								<span style="font-size:12px;">Copyright © 2020 AgriEdge-UM6P</span>
							</div>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
    
`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        msg: "fail",
        err: err,
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  });
};

module.exports = {
  create_Order,
  read_Orders,
  update_Order,
  delete_Order,
  find_Oeder,
  find_sellers_orders,
  sendEmail,
};
