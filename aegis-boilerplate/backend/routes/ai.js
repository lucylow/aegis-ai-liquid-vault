import express from 'express';

const router = express.Router();

// Get AI insights
router.get('/insights', async (req, res) => {
  try {
    const insights = {
      riskScore: 75,
      recommendations: [
        'Consider diversifying your ETH position',
        'BTC shows strong momentum, hold position',
        'Monitor MATIC for potential exit opportunity'
      ],
      threats: [
        { level: 'low', description: 'Market volatility within normal range' },
        { level: 'medium', description: 'ETH concentration risk' }
      ]
    };
    
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get security alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = [
      { type: 'info', message: 'All systems operational', timestamp: new Date().toISOString() },
      { type: 'warning', message: 'High gas fees detected on Ethereum', timestamp: new Date().toISOString() }
    ];
    
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
