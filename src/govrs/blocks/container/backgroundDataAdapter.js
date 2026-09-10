const backgroundDataAdapter = ({ block, data, id, onChangeBlock, value }) => {
  const nextData = {
    ...data,
    [id]: value,
  };

  delete nextData.videoPoster;

  if (id === 'backgroundType') {
    if (value !== 'image') {
      delete nextData.backgroundImage;
    }
    if (value !== 'video') {
      delete nextData.videoSource;
      delete nextData.videoFile;
      delete nextData.videoUrl;
      delete nextData.videoStart;
      delete nextData.videoEnd;
    } else if (!nextData.videoSource) {
      nextData.videoSource = data.videoFile ? 'file' : 'youtube';
    }
  }

  if (id === 'videoSource') {
    if (value === 'file') {
      delete nextData.videoUrl;
    } else {
      delete nextData.videoFile;
    }
  }

  onChangeBlock(block, nextData);
};

export default backgroundDataAdapter;
