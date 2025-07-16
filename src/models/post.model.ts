import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    coverImage: {
      type: Object,
      required: true,
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Post = model("Post", postSchema);
export default Post;
