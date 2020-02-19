import { Response } from 'express';
import AuthRequest from '../../../../type/AuthRequest';
import { getRepository } from 'typeorm';
import { validateCreate } from '../../../../lib/validation/comment';
import logger from '../../../../lib/logger';
import User from '../../../../entity/User';
import Post from '../../../../entity/Post';
import Comment from '../../../../entity/Comment';

export default async (req: AuthRequest, res: Response) => {
  if (!validateCreate(req, res)) return;

  const user: User = req.user;
  type RequestBody = {
    content: string;
    post_idx: number;
    reply_to: number | null;
  }

  const data: RequestBody = req.body;

  try {
    const postRepo = getRepository(Post);
    const post: Post = await postRepo.findOne({
      where: {
        idx: data.post_idx,
        is_deleted: false,
      },
    });

    if (!post) {
      logger.yellow('글 없음.');
      res.status(404).json({
        message: '글 없음.',
      });
      return;
    }

    // 비공개 글일 경우
    if (post.is_private) {
      if (!user || !user.is_admin) {
        logger.yellow('권한 없음.');
        res.status(403).json({
          message: '권한 없음.',
        });
        return;
      }
    }

    const commentRepo = getRepository(Comment);
    let replyToCommentIdx: number;

    // 답글일 경우
    if (data.reply_to) {
      const replyToComment: Comment = await commentRepo.findOne({
        where: {
          idx: data.reply_to,
          fk_post_idx: data.post_idx,
        },
      });

      if (!replyToComment) {
        logger.yellow('댓글 없음.');
        res.status(404).json({
          message: '댓글 없음.',
        });
        return;
      }

      replyToComment.has_replies = true;
      await commentRepo.save(replyToComment);
      replyToCommentIdx = replyToComment.idx;
    }

    const comment: Comment = new Comment;
    comment.content = data.content;
    comment.reply_to = replyToCommentIdx || null;
    comment.user = user || null;
    comment.post = post;
    await commentRepo.save(comment);

    logger.green('댓글 생성 성공.');
    res.status(200).json({
      message: '댓글 생성 성공.',
    });
  } catch (err) {
    logger.red('댓글 생성 서버 오류.', err.message);
    res.status(500).json({
      message: '서버 오류.',
    });
  }
}