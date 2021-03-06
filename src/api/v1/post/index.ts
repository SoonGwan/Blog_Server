import { Router } from 'express';
import authMiddleware from '../../../lib/middleware/auth';
import createPost from './post.ctrl/createPost';
import modifyPost from './post.ctrl/modifyPost';
import deletePost from './post.ctrl/deletePost';
import getPosts from './post.ctrl/getPosts';
import getPost from './post.ctrl/getPost';
import findPosts from './post.ctrl/findPosts';
import getTempPosts from './post.ctrl/getTempPosts';
import createTempPost from './post.ctrl/createTempPost';

const router = Router();

router.get('/find', authMiddleware.guest, findPosts);
router.get('/temp', authMiddleware.admin, getTempPosts);
router.post('/temp', authMiddleware.admin, createTempPost);

router.get('/', authMiddleware.guest, getPosts);
router.get('/:idx', authMiddleware.guest, getPost);
router.post('/', authMiddleware.admin, createPost);
router.put('/:idx', authMiddleware.admin, modifyPost);
router.delete('/:idx', authMiddleware.admin, deletePost);

export default router;