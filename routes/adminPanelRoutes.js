const express = require('express');
const router = express.Router();
const adminPanelController = require('../controllers/adminPanelController');
const {isAuth, isAdmin} = require("../helpers/helper");
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file ,cb){
        cb(null, 'images/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});
const upload = multer({storage:storage})


router.get('/', isAdmin, adminPanelController.admin_panel_index);
router.get('/editUser/:id', isAdmin, adminPanelController.edit_user_page);
router.post('/editUser/:id', isAdmin, adminPanelController.edit_user);
router.get('/addUser', isAdmin, adminPanelController.add_user_page);
router.post('/addUser', isAdmin, adminPanelController.add_user);
router.get('/addMovie', isAdmin, (req, res) => {
    res.render('addMovie');
})

router.post('/addMovie',upload.single('image'), isAdmin, adminPanelController.add_movie )
router.get('/editMovie/:id', isAdmin, adminPanelController.edit_movie_page);
router.post('/editMovie/:id', isAdmin, adminPanelController.edit_movie);

router.get('/deleteMovie/:id', isAdmin, adminPanelController.delete_movie);
router.get('/', (req, res) => {
    res.redirect('/');
});
module.exports = router;