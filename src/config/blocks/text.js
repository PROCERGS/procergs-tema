import TextAlignmentButton from '../../govrs/blocks/text/TextAlignmentButton';

export const addTextAlignmentButton = (buttons = []) =>
  buttons.includes('textAlignment')
    ? buttons
    : [...buttons, 'separator', 'textAlignment'];

const configureTextBlock = (config) => {
  const { slate } = config.settings;

  slate.buttons.textAlignment = TextAlignmentButton;
  slate.toolbarButtons = addTextAlignmentButton(slate.toolbarButtons);
  slate.expandedToolbarButtons = addTextAlignmentButton(
    slate.expandedToolbarButtons,
  );

  return config;
};

export default configureTextBlock;
