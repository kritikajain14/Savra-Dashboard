import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Activity from '../models/Activity.js';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Read Excel file
    const workbook = xlsx.readFile(path.join(__dirname, '../Savra_Teacher Data Set.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Clear existing data
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Transform and insert data
    const activities = data.map(row => ({
      teacher_id: row.Teacher_id,
      teacher_name: row.Teacher_name,
      activity_type: mapActivityType(row.Activity_type),
      subject: row.Subject,
      class: row.Grade?.toString(),
      created_at: new Date(row.Created_at)
    }));

    // Insert with duplicate checking
    let inserted = 0;
    let duplicates = 0;

    for (const activity of activities) {
      try {
        await Activity.create(activity);
        inserted++;
      } catch (error) {
        if (error.code === 11000) {
          duplicates++;
        } else {
          console.error('Error inserting activity:', error);
        }
      }
    }

    console.log(`Import completed: ${inserted} inserted, ${duplicates} duplicates skipped`);
    
    // Create indexes
    await Activity.collection.createIndex({ teacher_id: 1 });
    await Activity.collection.createIndex({ created_at: 1 });
    await Activity.collection.createIndex({ activity_type: 1 });
    
    console.log('Indexes created successfully');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

function mapActivityType(type) {
  const mapping = {
    'Quiz': 'quiz',
    'Lesson Plan': 'lesson',
    'Question Paper': 'assessment'
  };
  return mapping[type] || type.toLowerCase().replace(' ', '_');
}

importData();