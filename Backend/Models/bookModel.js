import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    source: String,
    rating: Number,
    review: String,
    sentiment: String,
});

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    author: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    genre: [{
        type: String
    }],

    tags: [{
        type: String
    }],

    moodTags: [{
        type: String
    }],

    difficultyLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },

    language: {
        type: String,
        default: "English"
    },

    publishYear: Number,

    averageRating: {
        type: Number,
        default: 0
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    borrowCount: {
        type: Number,
        default: 0
    },

    popularityScore: {
        type: Number,
        default: 0
    },

    aiSummary: String,

    criticSummary: String,

    reviews: [reviewSchema],

    vectorEmbedding: [{
        type: Number
    }],

    location: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },

    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"]
    },

    availability: {
        type: Boolean,
        default: true
    },

    image: {
        public_id: {
            type: String
        },

        url: {
            type: String
        }
    }

}, {
    timestamps: true
});

export const Book = mongoose.model("book", bookSchema);