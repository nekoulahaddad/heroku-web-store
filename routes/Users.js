const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const Payment = require('../models/Payment');
const async = require('async');

//sign up
router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "please fill all things" });
    }
    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json({ msg: "this user is already exist" });
        const newUser = new User({
            name,
            email,
            password
        });
        // tashfeer al password ( mn al mawke3 metl ma hie copy and paste)
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        jwt.sign({ id: user.id }, config.get("jwtsecret"), { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }

                            });
                        })
                    });
            })
        })
    })
});


router.put("/updateUser",auth,(req,res) => { 
    const {name,lastname,email,images} = req.body
       if (!name || !email) {
      return res.status(422).json({
        message: 'name, email are  required.'
      });
    }
User.findOneAndUpdate({_id:req.user.id},
    {$set:{name,lastname,email,images}},{ new: true }
    )
.then(()=> User.findOne({_id:req.user.id})
.then((user)=> res.json(user))
.catch((err)=> err.status(500))
.catch((err)=> res.json(err))
)
});

router.put("/changePassword",auth,(req,res) => { 
const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  User.findById(req.user.id,
    (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo

  // Compare passwords - Does the user provide correct old password?
  bcrypt.compare(oldPassword,user.password, function(err, isMatch) {

    if (err) res.send({msg:'mo zabta'});

    if (!isMatch) {
      return res.status(422).send({ msg: 'You old password is incorrect! Please try again.' })
    }

    if (oldPassword === newPassword) {
      return res.status(422).send({ msg: 'Your new password must be different from your old password!' });
    }

    // Update password
    user.password = newPassword;

bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) throw err;
                user.password = hash;

    // Save to DB
    user.save(function(err,user) {
     if (err) throw err;

      // Respond user request indicating that the password was updated successfully
      res.json(user);

    });
  });
})
})
})
});







//auth, req.user._id
//Add item to cart
router.get('/addToCart',auth, (req, res) => {


    User.findOne({ _id:req.user.id }, (err, userInfo) => {
        let duplicate = false;

        //console.log(userInfo)

        userInfo.cart.forEach((item) => {
            if (item.id == req.query.productId) { // req query it is what after ? in the link like 
                duplicate = true;
            }
        })

        //exp of req.query : 
        // GET /search?q=tobi+ferret
        //console.dir(req.query.q)
        // => 'tobi ferret'

        // GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
        //console.dir(req.query.order)
        // => 'desc'

        //console.dir(req.query.shoe.color)
        // => 'blue'

        //console.dir(req.query.shoe.type)
        // => 'converse'

        // GET /shoes?color[]=blue&color[]=black&color[]=red
        //console.dir(req.query.color)
        // => ['blue', 'black', 'red']




        if (duplicate) {
            User.findOneAndUpdate({ _id:req.user.id, "cart.id": req.query.productId }, { $inc: { "cart.$.quantity": 1 } }, // if i need to increase the quantity i use 1 or 2 or any possitive number and if i need to decrease i use -2 or -4 so a negative number
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate({ _id:req.user.id }, {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: new Date().toISOString().replace(/:/g, '-')
                        }
                    }
                }, { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
});
/*new :  boolean Optional. 
When true, returns the modified document rather than the original. 
The findAndModify method ignores the new option for remove operations. 
The default is false.


*/


//increase the quantity of the items
router.get('/removeOneFromCart',auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user.id, "cart.id": req.query.productId }, { $inc: { "cart.$.quantity": -1 } }, { new: true },
        (err, userInfo) => {
            if (err) return res.json(err);
            res.status(200).json(userInfo.cart)
        }

    )

});



// remove an item from the cart
router.get('/removeFromCart',auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user.id }, {
            $pull: //note: pull and push can be written "$pull" and "$push" and $pull and $push so with and without ""
            { "cart": { "id": req.query.productId } }
        }, { new: true },
        (err, userInfo) => {
if (err) return res.json(err);
            res.status(200).json(userInfo.cart)
        }

    )

});
            /*
            let cart = userInfo.cart;
            let array = cart.map(item => { // al array feha al id tb3 kl al item yly bel cart tb3 al user
                return item.id
            })

            Item.find({ '_id': { $in: array } }) // if i need to get more info go to link https://mongoosejs.com/docs/populate.html
                .populate('writer') // if i need to get more info go to link https://mongoosejs.com/docs/populate.html
                .exec((err, cartDetail) => { // if i need to get more info go to link https://mongoosejs.com/docs/populate.html
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })
        }
    )
})
*/

//get cart information
router.get('/userCartInfo',auth, (req, res) => {
    User.findOne({ _id: req.user.id },
        (err, user) => {
            if (err) return res.status(404).send(err);
            let cart = user.cart;
            let array = cart.map(item => {
                return item.id
            });

 Item.find({ _id: { $in: array } }) // how $in works --> it is like if function --> it activates the call back fun (.populate in our case) --> if the collection 'item' has any of the values that in the 'array' in the _id section --> so in our case it must be true and call back func will be activated
              .populate('writer')
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ cartDetail, cart})
                })

        }
    )
})

/*
populate and exec it used to push all the information about a model to another model using the id for example and using 'ref' in the Schema
for example :
here when we used populate writer and the writer is referenced to the user in the Schema of the item 
so it will give me all the information of the user like his name and email and all these stuff 
to use it in the cart info --> so i can use after that -->
console.log('The writer is :', item.writer.name,item.writer.name);


*/




/* 
// complete the purchase   i can use it without paypal information with paypal - here used with paypal
router.post('/successBuy', (req, res) => {
    let history = [];
    let transactionData = {};

    //1.Put brief Payment Information inside User Collection 
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: new Date().toISOString().replace(/:/g, '-'),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID  // hie al she3`le al wa7ede yly btkon bel body
        })
    })

    //2.Put Payment Information that come from Paypal into Payment Collection 
    transactionData.user = {                      // information about the user
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;   // information about the payment
    transactionData.product = history              // information about the products that user bought 


    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });


            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                //3. Increase the amount of number for the sold information 

                //first We need to know how many product were sold in this transaction for 
                // each of products

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                // first Item    quantity 2
                // second Item  quantity 3

                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })

            })
        }
    )
})

*/
//without paypal
router.post('/successBuy',auth, (req, res) => {
    const history = [];
    const transactionData = {};

    //1.Put brief Payment Information inside User Collection 
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: new Date().toISOString().replace(/:/g, '-'),
            name: item.name,
            id: item._id,
            price: item.price,
            quantity: item.quantity
        })
    })

    //2.Put Payment Information that come from Paypal into Payment Collection 
    transactionData.user = { // information about the user
        id: req.user.id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.product = history // information about the products that user bought 

    User.findOneAndUpdate({ _id: req.user.id }, { $push: { history: history }, $set: { cart: [] } }, { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });


            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                //3. Increase the amount of number for the sold information 

                //first We need to know how many product were sold in this transaction for 
                // each of products

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                // first Item    quantity 2
                // second Item  quantity 3

                async.eachSeries(products, (item, callback) => {
                    Item.update({ _id: item.id }, {
                            $inc: {
                                "sold": item.quantity
                            }
                        }, { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        cart: [],
                        cartDetail: []
                    })
                })

            })
        }
    )
})








// getting history of the products that i had bought before
router.get('/getHistory', auth, (req, res) => {
    User.findOne({ _id: req.user.id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})






module.exports = router;