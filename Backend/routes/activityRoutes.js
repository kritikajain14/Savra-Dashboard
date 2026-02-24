import express from 'express';
import {
  getOverview,
  getTeacherData,
  getTrends,
  getAllTeachers,
  // createActivity,
  getSubjectDistribution,
  getMonthlyGrowth,
  getTeacherDistribution,
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/teacher/:id', getTeacherData);
router.get('/trends', getTrends);
router.get('/teachers', getAllTeachers);
router.get('/teacher-distribution', getTeacherDistribution);
router.get('/subject-distribution', getSubjectDistribution);
router.get('/monthly-growth', getMonthlyGrowth);
// router.post('/activity', createActivity);

export default router;