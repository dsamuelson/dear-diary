const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    updateUser({ params, body}, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    addFriend({ params }, res) {
        User.findOne({ _id: params.userId })
        .then(user => User.updateOne({ _id: user.id}, { $push: { friends: params.friendId }}, { new: true }))
        .then(() => User.findOne({ _id: params.friendId}))
        .then(friend => User.updateOne({_id: friend.id }, { $push: { friends: params.userId }}, { new: true }))
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this ID' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    removeFriend({ params }, res) {
        User.findOne({ _id: params.userId })
        .then(user => User.updateOne({ _id: user.id}, { $pull: { friends: params.friendId }}, { new: true }))
        .then(() => User.findOne({ _id: params.friendId }))
        .then(friend => User.updateOne({_id: friend.id }, { $pull: { friends: params.userId }}, { new: true }))
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    deleteUser({ params }, res) {
        User.findOne({ _id: params.userId })
        .then(user => Thought.updateMany({}, { $pull: { reactions: { username: user.username }}}, { new: true }))
        .then(() => User.deleteOne({ _id: params.userId }))
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
}

module.exports = userController;