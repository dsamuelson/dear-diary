const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    getReactionsForThought,
    addThought,
    updateThought,
    addReaction,
    removeThought,
    removeReaction
} = require('../../controllers/thought-controller');

router
.route('/')
.get(getAllThoughts);

router
.route('/:userId')
.post(addThought);

router
.route('/:thoughtId/reactions')
.get(getReactionsForThought)
.post(addReaction);

router
.route('/:thoughtId')
.get(getThoughtById)
.put(updateThought)
.delete(removeThought);

router
.route('/:thoughtId/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;