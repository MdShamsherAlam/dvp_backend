import { Router } from 'express';
import multer from 'multer';
import { uploadVideo } from '../controllers/video.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload', upload.single('file'), uploadVideo);

export default router;
