// Init router
const express = require('express');
const router = express.Router()

// get mongo model
const ShoppingList = require('../../models/ShoppingList')

router.get('/', (req, res) => {
    ShoppingList.find()
    .then(data => {
        res.json({data: data})
    })
    .catch(err => {
        res.json({msg: 'Error', Error: err})
    }
)
})

router.post('/', (req, res) => {
    if(!req.body.item) {
        res.status(400).json({err: 'You need to specify item to add'})
    } else {
        const newItem = new ShoppingList({
            item : req.body.item,
            quantity: req.body.quantity ? req.body.quantity : 1
        })
        if (req.body.price) {
            newItem.price = req.body.price
        }
        newItem.save()
        .then(data => {
            res.json({
                msg: 'Success! New item added',
                data: newItem
        })
    })
        .catch(err => {
            res.status(400).json({
                msg: 'Error! Something Went wrong',
                error: err
            })
        })
    }
})

router.delete('/', (req, res) => {
    if(req.body.id) {
        ShoppingList.deleteOne({_id : req.body.id})
        .then(result => res.json({
            msg: `Success! Record with id ${req.body.id} deleted`,
            data: result
        }))
        .catch(err => res.status(400).json({
            msg: `Error! Something went wrong`,
            error: err
        }))
    }
})

// update item
router.post('/update', (req, res) => {
    const filter = {_id : req.body.id}
    let update = {}
    if(req.body.quantity) {
        update.quantity = req.body.quantity
    }
    if(req.body.price) {
        update.price = req.body.price
    }
    if(req.body.item) {
        update.item = req.body.item
    }
    ShoppingList.findOneAndUpdate(filter, update, {new: true})
    .then(data => {
        res.json({
            msg: `Success! item Updated`,
            data: data
        })
    })
    .catch(err => {
        res.status(400).json({
        msg: 'Error! something went wrong',
        error: err
    })})
})


// export router
module.exports = router;