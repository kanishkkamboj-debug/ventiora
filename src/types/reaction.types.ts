import type { TargetType } from './common.types';

export type ReactionType = 'LIKE' | 'LOVE' | 'FUNNY' | 'SAD' | 'ANGRY';

export const REACTION_EMOJI: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  FUNNY: '😂',
  SAD: '😢',
  ANGRY: '😡',
};

export const REACTION_LABEL: Record<ReactionType, string> = {
  LIKE: 'Like',
  LOVE: 'Love',
  FUNNY: 'Funny',
  SAD: 'Sad',
  ANGRY: 'Angry',
};

export interface ReactRequest {
  targetType: TargetType;
  targetId: string;
  reactionType: ReactionType;
}
