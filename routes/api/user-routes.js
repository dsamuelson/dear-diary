const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    addFriend,
    removeFriend,
    deleteUser
} = require('../../controllers/user-controller')

// sets up routes for API calls and returns for Users

router
.route('/')
.get(getAllUsers)
.post(createUser)

router
.route('/:userId')
.get(getUserById)
.put(updateUser)
.delete(deleteUser)

router
.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(removeFriend);

module.exports = router;