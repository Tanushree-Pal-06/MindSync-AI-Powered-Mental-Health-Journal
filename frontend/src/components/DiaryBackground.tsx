import { memo } from 'react';

const DiaryBackground = memo(() => {
  return (
    <div className="diary-bg-container" aria-hidden="true">
      {/* Breathing gradient orbs */}
      <div className="diary-bg-orb diary-bg-orb-1" />
      <div className="diary-bg-orb diary-bg-orb-2" />
      <div className="diary-bg-orb diary-bg-orb-3" />

      {/* Floating diary pages */}
      <div className="diary-page diary-page-1">
        <div className="diary-page-lines" />
      </div>
      <div className="diary-page diary-page-2">
        <div className="diary-page-lines" />
      </div>
      <div className="diary-page diary-page-3">
        <div className="diary-page-lines" />
      </div>

      {/* Faded handwritten text fragments */}
      <span className="diary-ghost-text diary-ghost-1">today I felt...</span>
      <span className="diary-ghost-text diary-ghost-2">grateful for</span>
      <span className="diary-ghost-text diary-ghost-3">a quiet moment</span>
      <span className="diary-ghost-text diary-ghost-4">breathe</span>
    </div>
  );
});

DiaryBackground.displayName = 'DiaryBackground';
export default DiaryBackground;
