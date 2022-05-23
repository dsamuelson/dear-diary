const { User, Thought } = require('../models');

// sets up the functions for user based API calls

const userController = {
    // gets all users in the database and populates their thoughts and friends lists
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
    // gets a single user based on ID and populates their thoughts and friends lists
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
    // creates a new user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    //update a user based on their ID
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
    // looks for a user based on ID, then updates the friends list for that user with the information for the friend using the friendId
    // then it looks for the other user based on the listed friendId and updates their friend list with the user's information
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
    // removes the friends from both the friends list of the user and friends list of the friend based on their IDs
    // in a similar fashion to adding them above
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
    // Uses a userId to get a username, then removes any thoughts or reactions in the database that contain this user's unique username
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