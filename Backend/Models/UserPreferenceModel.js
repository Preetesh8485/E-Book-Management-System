import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    favoriteGenres: [String],

    favoriteMoods: [String],

    favoriteAuthors: [String],
  },
  { timestamps: true }
);

export const UserPreference = mongoose.model(
  "UserPreference",
  userPreferenceSchema
);