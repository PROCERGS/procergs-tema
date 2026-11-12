import { Node } from 'slate';
import { withHistory } from 'slate-history';

export const createFileTitleValue = (title = '') => [
  { type: 'p', children: [{ text: title }] },
];

const singleLine = (text) => text.replace(/[\r\n\t]+/g, ' ');

export const getFileTitleText = (value = []) =>
  singleLine(value.map((node) => Node.string(node)).join(' '));

const withPlainFileTitle = (editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => insertText(singleLine(text));
  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text) editor.insertText(text);
  };
  editor.insertFragment = (fragment) => {
    const text = getFileTitleText(fragment);
    if (text) editor.insertText(text);
  };
  // A file name is one text field, so it cannot create paragraphs or marks.
  editor.insertBreak = () => {};
  editor.insertSoftBreak = () => {};
  editor.addMark = () => {};
  editor.removeMark = () => {};

  return editor;
};

export const fileTitleExtensions = [withHistory, withPlainFileTitle];

export const getFileTitleSlateSettings = (settings) => ({
  ...settings,
  hotkeys: {},
  toolbarButtons: [],
  expandedToolbarButtons: [],
  contextToolbarButtons: [],
  elementToolbarButtons: {},
  persistentHelpers: [],
  showExpandedToolbar: false,
  enableExpandedToolbar: false,
});
