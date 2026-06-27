import React from 'react';
import { REACTION_EMOJI, REACTION_LABEL } from '../../types/reaction.types';
import type { ReactionType } from '../../types/reaction.types';

const REACTION_ORDER: ReactionType[] = ['LIKE', 'LOVE', 'FUNNY', 'SAD', 'ANGRY'];

interface ReactionPickerProps {
  onSelect: (type: ReactionType) => void;
}

export function ReactionPicker({ onSelect }: ReactionPickerProps) {
  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-full shadow-lg px-3 py-2">
      {REACTION_ORDER.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          title={REACTION_LABEL[type]}
          className="text-xl hover:scale-125 transition-transform"
        >
          {REACTION_EMOJI[type]}
        </button>
      ))}
    </div>
  );
}
