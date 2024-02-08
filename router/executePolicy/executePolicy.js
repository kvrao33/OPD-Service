
import express from 'express';
import knexInstance from '../../dbconfig';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        knexInstance
    } catch (error) {
            }
});


export default router;
