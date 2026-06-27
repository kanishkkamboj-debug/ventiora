import { mockComments } from '../utils/mockData';

export const getCommentsByPostId = async (postId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const postComments = mockComments.filter(c => c.postId === postId);
  return { data: { content: postComments } };
};
