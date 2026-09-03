import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import normalizeSection from './normalizeSection';

const SectionBlockBody = ({
  data,
  children,
  className,
  style,
  isEditMode = false,
}) => {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const normalized = normalizeSection(data);
  const {
    backgroundType,
    backgroundColor,
    foregroundColor,
    imageUrl,
    videoUrl,
    videoProvider,
    videoStart,
    videoEnd,
    overlayOpacity,
    mediaPosition,
    minHeight,
    contentWidth,
    spacing,
  } = normalized;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setMotionAllowed(!mediaQuery.matches);

    updateMotionPreference();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMotionPreference);
    } else {
      mediaQuery.addListener?.(updateMotionPreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMotionPreference);
      } else {
        mediaQuery.removeListener?.(updateMotionPreference);
      }
    };
  }, []);

  const restartVideoFile = (video) => {
    const maximumStart = Number.isFinite(video.duration)
      ? Math.max(0, video.duration - 0.01)
      : videoStart;
    video.currentTime = Math.min(videoStart, maximumStart);
    video.play?.().catch(() => {});
  };

  const handleVideoTimeUpdate = (event) => {
    if (videoEnd && event.currentTarget.currentTime >= videoEnd) {
      restartVideoFile(event.currentTarget);
    }
  };

  const sectionStyle = {
    ...style,
    '--procergs-section-background': backgroundColor,
    '--procergs-section-foreground': foregroundColor,
    '--procergs-section-overlay-opacity': overlayOpacity,
    '--procergs-section-min-height': minHeight,
  };

  return (
    <div
      className={cx(
        'block procergsSection govrs-section-block',
        `govrs-section-block--${backgroundType}`,
        `govrs-section-block--position-${mediaPosition}`,
        `govrs-section-block--width-${contentWidth}`,
        `govrs-section-block--spacing-${spacing}`,
        { 'govrs-section-block--editing': isEditMode },
        className,
      )}
      style={sectionStyle}
    >
      <div className="govrs-section-block__background" aria-hidden="true">
        {backgroundType === 'image' && imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" />
        ) : null}
        {backgroundType === 'video' &&
        videoUrl &&
        videoProvider === 'file' &&
        motionAllowed ? (
          <video
            src={videoUrl}
            autoPlay
            muted
            playsInline
            preload="metadata"
            tabIndex="-1"
            onLoadedMetadata={(event) => restartVideoFile(event.currentTarget)}
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={(event) => restartVideoFile(event.currentTarget)}
          />
        ) : null}
        {backgroundType === 'video' &&
        videoUrl &&
        videoProvider === 'youtube' &&
        motionAllowed ? (
          <iframe
            src={videoUrl}
            title="Vídeo de fundo do YouTube"
            allow="autoplay; encrypted-media"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex="-1"
          />
        ) : null}
        {backgroundType === 'image' || backgroundType === 'video' ? (
          <span className="govrs-section-block__overlay" />
        ) : null}
      </div>
      <div
        className={cx('govrs-section-block__content', {
          'ui container': contentWidth === 'layout',
        })}
      >
        {children}
      </div>
    </div>
  );
};

SectionBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  isEditMode: PropTypes.bool,
};

export default SectionBlockBody;
