import { model, Schema } from 'mongoose';

const tagSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Tag must be at least 2 characters'],
    maxlength: [30, 'Tag must be at most 30 characters'],
  },
});

const Tag = model('Tag', tagSchema);

export default Tag