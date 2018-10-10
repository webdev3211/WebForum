var mongoose = require('mongoose');
var Tag = require('../models/tags');
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    Tag.find({}).then(
        (data) => {
            if (!data)
                return res.status(501).json({
                    success: false,
                    message: "No data found!"
                });
            res.status(200).json({
                success: true,
                data: data
            });

        }
    ).catch((err) => {
        res.status(501).json({
            success: false,
            message: "Unable to Find Tags"
        });
    });
});


router.post('/', (req, res, next) => {

    var tag = new Tag({
        tag: req.body.tag,
        description: req.body.description
    });
    tag.save()
        .then(
            (data) => {
                if (!data)
                    return res.status(501).json({
                        success: false,
                        message: "Unable to save"
                    });
                res.status(200).json({
                    success: true,
                    data: data
                });

            }
        ).catch((err) => {
            res.status(501).json({
                success: false,
                message: "Unable To save tag"
            });
        });
});
//Exporting the router
module.exports = router;