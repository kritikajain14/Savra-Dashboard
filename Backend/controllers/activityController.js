import Activity from '../models/Activity.js';

export const getOverview = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const matchStage = dateFilter ? { created_at: { $gte: dateFilter } } : {};
    
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$activity_type',
          count: { $sum: 1 }
        }
      }
    ];

    const activities = await Activity.aggregate(pipeline);
    
    // Get unique teacher count for the period
    const teacherCount = await Activity.distinct('teacher_id', matchStage);
    
    const result = {
      lessons: activities.find(a => a._id === 'lesson')?.count || 0,
      quizzes: activities.find(a => a._id === 'quiz')?.count || 0,
      assessments: activities.find(a => a._id === 'assessment')?.count || 0,
      totalTeachers: teacherCount.length
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrends = async (req, res) => {
  try {
    const { teacher_id, period = 'week' } = req.query;
    
    const match = teacher_id ? { teacher_id } : {};
    const dateFilter = getDateFilter(period);
    if (dateFilter) {
      match.created_at = { $gte: dateFilter };
    }
    
    const groupBy = getGroupByStage(period);
    
    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            ...groupBy,
            activity_type: '$activity_type'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } }
    ];

    const trends = await Activity.aggregate(pipeline);
    
    // Format trends based on period
    const formattedTrends = formatTrendsByPeriod(trends, period);
    
    res.json(formattedTrends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacherDistribution = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const dateFilter = getDateFilter(period);
    
    const matchStage = dateFilter ? { created_at: { $gte: dateFilter } } : {};
    
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$teacher_id',
          teacher_name: { $first: '$teacher_name' },
          lessons: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'lesson'] }, 1, 0] }
          },
          quizzes: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'quiz'] }, 1, 0] }
          },
          assessments: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'assessment'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ];

    const teachers = await Activity.aggregate(pipeline);
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubjectDistribution = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ];

    const distribution = await Activity.aggregate(pipeline);
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyGrowth = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          total: { $sum: 1 },
          lessons: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'lesson'] }, 1, 0] }
          },
          quizzes: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'quiz'] }, 1, 0] }
          },
          assessments: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'assessment'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ];

    const growth = await Activity.aggregate(pipeline);
    
    const formatted = growth.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      total: item.total,
      lessons: item.lessons,
      quizzes: item.quizzes,
      assessments: item.assessments
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
function getDateFilter(period) {
  const now = new Date();
  switch(period) {
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return weekAgo;
    case 'month':
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return monthAgo;
    case 'year':
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      return yearAgo;
    default:
      return null;
  }
}

function getGroupByStage(period) {
  const base = {
    year: { $year: '$created_at' }
  };
  
  switch(period) {
    case 'week':
      return { ...base, week: { $week: '$created_at' } };
    case 'month':
      return { ...base, month: { $month: '$created_at' } };
    case 'year':
      return { ...base, month: { $month: '$created_at' } };
    default:
      return { ...base, week: { $week: '$created_at' } };
  }
}

function formatTrendsByPeriod(trends, period) {
  const formatted = {};
  
  trends.forEach(item => {
    let periodKey;
    switch(period) {
      case 'week':
        periodKey = `Week ${item._id.week}, ${item._id.year}`;
        break;
      case 'month':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        periodKey = `${monthNames[item._id.month - 1]} ${item._id.year}`;
        break;
      case 'year':
        periodKey = `Q${Math.ceil(item._id.month / 3)} ${item._id.year}`;
        break;
      default:
        periodKey = `Week ${item._id.week}, ${item._id.year}`;
    }
    
    if (!formatted[periodKey]) {
      formatted[periodKey] = {
        period: periodKey,
        lessons: 0,
        quizzes: 0,
        assessments: 0,
        total: 0
      };
    }
    
    formatted[periodKey][item._id.activity_type] = item.count;
    formatted[periodKey].total += item.count;
  });
  
  return Object.values(formatted);
}

export const getAllTeachers = async (req, res) => {
  try {
    const { period } = req.query;
    const dateFilter = getDateFilter(period);

    const matchStage = dateFilter
      ? { created_at: { $gte: dateFilter } }
      : {};

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$teacher_id',
          teacher_name: { $first: '$teacher_name' },
          totalActivities: { $sum: 1 },
          lessons: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'lesson'] }, 1, 0] }
          },
          quizzes: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'quiz'] }, 1, 0] }
          },
          assessments: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'assessment'] }, 1, 0] }
          }
        }
      },
      { $sort: { teacher_name: 1 } }
    ];

    const teachers = await Activity.aggregate(pipeline);

    const formatted = teachers.map(t => ({
      teacher_id: t._id,
      teacher_name: t.teacher_name,
      totalActivities: t.totalActivities,
      lessons: t.lessons,
      quizzes: t.quizzes,
      assessments: t.assessments
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacherData = async (req, res) => {
  try {
  const teacher_id = req.params.id;
const { period = 'week' } = req.query;
    if (!teacher_id) {
      return res.status(400).json({ error: 'teacher_id is required' });
    }

    const dateFilter = getDateFilter(period);

    const match = { teacher_id };
    if (dateFilter) {
      match.created_at = { $gte: dateFilter };
    }

    // 1️⃣ Overview Counts
    const overviewPipeline = [
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          lessons: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'lesson'] }, 1, 0] }
          },
          quizzes: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'quiz'] }, 1, 0] }
          },
          assessments: {
            $sum: { $cond: [{ $eq: ['$activity_type', 'assessment'] }, 1, 0] }
          }
        }
      }
    ];

    // 2️⃣ Subject Distribution
    const subjectPipeline = [
      { $match: match },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ];

    // 3️⃣ Monthly Growth (for this teacher)
    const growthPipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ];

    const [overviewResult, subjectDistribution, growth] = await Promise.all([
      Activity.aggregate(overviewPipeline),
      Activity.aggregate(subjectPipeline),
      Activity.aggregate(growthPipeline)
    ]);

    const overview = overviewResult[0] || {
      total: 0,
      lessons: 0,
      quizzes: 0,
      assessments: 0
    };

    const formattedGrowth = growth.map(item => ({
      month: `${item._id.year}-${item._id.month
        .toString()
        .padStart(2, '0')}`,
      total: item.total
    }));

    res.json({
      teacher_id,
      period,
      overview,
      subjectDistribution,
      growth: formattedGrowth
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

