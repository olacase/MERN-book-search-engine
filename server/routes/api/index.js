const path = require('path')
const router = require('express').Router();
const userRoutes = require('./user-routes');


router.use('/users', userRoutes);

// serve react front-end in production
router.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
  

module.exports = router;
