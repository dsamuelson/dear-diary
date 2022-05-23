const { User, Thought } = require('../models');

const thoughtController = {
    addThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId},
                { $push: { thoughts: _id }},
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with that ID was found '});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body} },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought with this ID was found' });
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
}