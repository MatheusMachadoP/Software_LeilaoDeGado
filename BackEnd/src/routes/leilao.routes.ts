import { Router } from 'express';
import { getBalance } from '../services/contract.service';

const router = Router();

router.get('/balance/:address', async (req, res) => {
  try {
    const balance = await getBalance(req.params.address);
    res.json({ balance });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

export default router;