const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            match: /.{0,280}/
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment().format("MMM, D, YYYY LT Z")
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
)

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            match:/.{1,280}/
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => moment().format("ddd, MMM, Do, YYYY LT Z")
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;