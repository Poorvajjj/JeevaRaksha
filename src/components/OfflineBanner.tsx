import React from 'react';
import { Language } from '../types';
import { getT } from '../i18n/translations';

interface OfflineBannerProps {
  isOffline: boolean;
  pendingCount: number;
  onSync: () => void;
  language: Language;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  pendingCount,
  onSync,
  language,
}) => {
  const t = getT(language);

  if (!isOffline && pendingCount === 0) return null;

  return (
    <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 text-xs sm:text-sm text-[#92400E]">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse" />
          <span>
            {isOffline
              ? t.offline_banner
              : `${pendingCount} ${t.pending_sync}.`}
          </span>
        </div>
        {pendingCount > 0 && !isOffline && (
          <button
            onClick={onSync}
            className="px-3 py-1 rounded bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] transition-colors"
          >
            {t.sync_now}
          </button>
        )}
      </div>
    </div>
  );
};
