import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  teacher_id: {
    type: String,
    required: true,
    index: true
  },
  teacher_name: {
    type: String,
    required: true
  },
  activity_type: {
    type: String,
    enum: ['lesson', 'quiz', 'assessment'],
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  subject: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
});

// Compound index for duplicate checking
activitySchema.index(
  { teacher_id: 1, activity_type: 1, created_at: 1 }, 
  { unique: true }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;