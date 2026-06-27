import React, { useState } from 'react';
import { REACTION_EMOJI, REACTION_LABEL } from '../../types/reaction.types';
import type { ReactionType } from '../../types/reaction.types';
import type { ReactionCount } from '../../types/post.types';
import { cn } from '../../utils/cn';

interface ReactionBarProps {
  reactions: ReactionCount[];
  onReact?: (type: ReactionType) => void;
}

const REACTION_ORDER: ReactionType[] = ['LIKE', 'LOVE', 'FUNNY', 'SAD', 'ANGRY'];

export function ReactionBar({ reactions, onReact }: ReactionBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const reacted = reactions.find((r) => r.reacted);

  const handleReact = (type: ReactionType) => {
    onReact?.(type);
    setPickerOpen(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Existing reactions */}
      {REACTION_ORDER.filter((t) => {
        const r = reactions.find((x) => x.type === t);
        return r && r.count > 0;
      }).map((type) => {
        const r = reactions.find((x) => x.type === type)!;
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-all',
              r.reacted
                ? 'border-primary bg-on-primary-container text-primary font-semibold'
                : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary hover:text-primary',
            )}
          >
            <span>{REACTION_EMOJI[type]}</span>
            <span className="text-xs font-medium">{r.count}</span>
          </button>
        );
      })}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setPickerOpen((o) => !o)}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all"
        >
          <span>{reacted ? REACTION_EMOJI[reacted.type] : '＋'}</span>
          <span className="text-xs">{reacted ? 'Reacted' : 'React'}</span>
        </button>

        {pickerOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
            <div className="absolute bottom-10 left-0 z-20 flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full shadow-lg px-3 py-2 animate-fadeIn">
              {REACTION_ORDER.map((type) => (
                <button
                  key={type}
                  onClick={() => handleReact(type)}
                  title={REACTION_LABEL[type]}
                  className="text-xl hover:scale-125 transition-transform"
                >
                  {REACTION_EMOJI[type]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
