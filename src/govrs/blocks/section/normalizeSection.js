import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';

const DEFAULT_COLOR_PAIR = {
  background: '#ffffff',
  foreground: '#000000',
};

const firstItem = (value) => (Array.isArray(value) ? value[0] : value);

const resolveImage = (value) => {
  const item = firstItem(value);

  if (!item) return undefined;
  if (typeof item === 'object') {
    return resolveImageUrlFromContent(item);
  }
  if (typeof item !== 'string') return undefined;

  return isInternalURL(item) ? `${flattenToAppURL(item)}/@@images/image` : item;
};

const isSupportedVideoUrl = (value) => {
  if (!value || typeof value !== 'string') return false;

  try {
    const url = new URL(value, 'https://volto.local');
    return /\.(mp4|webm)$/i.test(url.pathname);
  } catch {
    return false;
  }
};

const getYouTubeVideoId = (value) => {
  if (!value || typeof value !== 'string') return undefined;

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.replace(/^(www\.|m\.)/, '');
    let videoId;

    if (hostname === 'youtu.be') {
      [videoId] = url.pathname.split('/').filter(Boolean);
    } else if (
      hostname === 'youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      videoId =
        pathParts[0] === 'watch'
          ? url.searchParams.get('v')
          : ['embed', 'shorts', 'live'].includes(pathParts[0])
            ? pathParts[1]
            : undefined;
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : undefined;
  } catch {
    return undefined;
  }
};

const getYouTubeEmbedUrl = (videoId, videoStart, videoEnd) => {
  const parameters = new URLSearchParams({
    autoplay: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    loop: '1',
    modestbranding: '1',
    mute: '1',
    playlist: videoId,
    playsinline: '1',
    rel: '0',
  });
  const start = Math.floor(videoStart);

  if (start > 0) {
    parameters.set('start', String(start));
  }
  if (videoEnd) {
    parameters.set('end', String(Math.floor(videoEnd)));
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${parameters}`;
};

const resolveVideoFile = (file) => {
  const item = firstItem(file);
  const itemUrl = typeof item === 'object' ? item?.['@id'] : item;

  if (itemUrl && typeof itemUrl === 'string') {
    if (isInternalURL(itemUrl)) {
      return {
        provider: 'file',
        url: `${flattenToAppURL(itemUrl)}/@@download/file`,
      };
    }
    if (isSupportedVideoUrl(itemUrl)) {
      return { provider: 'file', url: itemUrl };
    }
  }

  return {};
};

const resolveYouTubeVideo = (videoUrl, videoStart, videoEnd) => {
  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  return youtubeVideoId
    ? {
        provider: 'youtube',
        url: getYouTubeEmbedUrl(youtubeVideoId, videoStart, videoEnd),
      }
    : {};
};

const choice = (value, choices, fallback) =>
  choices.includes(value) ? value : fallback;

const getVideoTiming = (startValue, endValue) => {
  const parsedStart = Number(startValue);
  const videoStart =
    Number.isFinite(parsedStart) && parsedStart >= 0 ? parsedStart : 0;
  const parsedEnd =
    endValue === undefined || endValue === null || endValue === ''
      ? undefined
      : Number(endValue);
  const videoEnd =
    Number.isFinite(parsedEnd) && parsedEnd > videoStart
      ? parsedEnd
      : undefined;

  return { videoStart, videoEnd };
};

export const normalizeSection = (data = {}) => {
  const requestedPair = data.colorPair || DEFAULT_COLOR_PAIR;
  const colorPair = {
    background: requestedPair.background || DEFAULT_COLOR_PAIR.background,
    foreground: requestedPair.foreground || DEFAULT_COLOR_PAIR.foreground,
  };
  const backgroundType = choice(
    data.backgroundType,
    ['none', 'color', 'image', 'video'],
    'none',
  );
  const imageUrl = resolveImage(data.backgroundImage);
  const videoSource = choice(
    data.videoSource,
    ['youtube', 'file'],
    data.videoFile ? 'file' : 'youtube',
  );
  const { videoStart, videoEnd } = getVideoTiming(
    data.videoStart,
    data.videoEnd,
  );
  const video =
    videoSource === 'file'
      ? resolveVideoFile(data.videoFile)
      : resolveYouTubeVideo(data.videoUrl, videoStart, videoEnd);
  const hasMedia =
    (backgroundType === 'image' && imageUrl) ||
    (backgroundType === 'video' && video.url);
  const requestedOpacity = Math.max(
    0,
    Math.min(1, Number(data.overlayOpacity ?? 0.6)),
  );
  const overlayOpacity = hasMedia
    ? requestedOpacity
    : backgroundType === 'color'
      ? 1
      : 0;

  return {
    backgroundType,
    backgroundColor:
      backgroundType === 'none' ? 'transparent' : colorPair.background,
    foregroundColor:
      backgroundType === 'none' ? 'inherit' : colorPair.foreground,
    imageUrl,
    videoUrl: video.url,
    videoProvider: video.provider,
    videoStart,
    videoEnd,
    overlayOpacity,
    mediaPosition: choice(
      data.mediaPosition,
      ['center', 'top', 'bottom', 'left', 'right'],
      'center',
    ),
    minHeight: choice(
      data.minHeight,
      ['auto', '50vh', '70vh', '100svh'],
      'auto',
    ),
    contentWidth: choice(
      data.contentWidth,
      ['narrow', 'default', 'layout', 'full'],
      'layout',
    ),
    spacing: choice(
      data.spacing,
      ['compact', 'default', 'spacious'],
      'default',
    ),
  };
};

export default normalizeSection;
