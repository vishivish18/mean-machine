var express = require('express')
var router = require('express').Router()
var path = require('path')


router.use(express.static(path.resolve('public/assets/')))
router.use(express.static(__dirname + '/../../public/app/views'))
router.get('*', function(req, res) {
	res.sendFile(path.resolve('public/index.html'));
});



module.exports = router;
