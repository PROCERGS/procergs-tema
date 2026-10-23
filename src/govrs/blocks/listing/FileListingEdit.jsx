import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { List } from '@procergs/react-govrs-ds';
import SlateEditor from '@plone/volto-slate/editor/SlateEditor';
import EditorReference from '@plone/volto-slate/editor/EditorReference';
import config from '@plone/volto/registry';
import {
  createFileTitleValue,
  fileTitleExtensions,
  getFileTitleSlateSettings,
  getFileTitleText,
} from './fileTitleSlate';

const FileTitleParagraph = ({ attributes, children }) => (
  <span {...attributes}>{children}</span>
);

const InlineFileTitle = ({ item, onTitleChange, onTitleFocus }) => {
  const editorId = useId();
  const title = item.displayTitle || item.title;
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(() => createFileTitleValue(title));
  const editorRef = useRef(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const handleEditor = useCallback((editor) => {
    editorRef.current = editor;
  }, []);
  const slateSettings = useMemo(
    () => getFileTitleSlateSettings(config.settings.slate),
    [],
  );

  useEffect(() => {
    // Keep empty text and trailing spaces while typing; sync external changes
    // only when inactive, so rerenders do not move the caret.
    if (!focused && getFileTitleText(valueRef.current) !== title) {
      // External replacements, including restoring the original name, invalidate
      // undo operations recorded for the previous text.
      if (editorRef.current) {
        editorRef.current.history = { undos: [], redos: [] };
      }
      setValue(createFileTitleValue(title));
    }
  }, [focused, title]);

  return (
    <span
      className="govrs-file-listing-editor__field"
      onFocusCapture={() => {
        setFocused(true);
        onTitleFocus?.();
      }}
      onKeyDown={(event) => event.stopPropagation()}
      role="presentation"
    >
      <span id={'field-' + editorId} hidden>
        {'Nome exibido para ' + item.title}
      </span>
      <SlateEditor
        id={editorId}
        value={value}
        selected={focused}
        extensions={fileTitleExtensions}
        slateSettings={slateSettings}
        placeholder={item.title}
        onChange={(nextValue) => {
          setValue(nextValue);
          onTitleChange(item, getFileTitleText(nextValue));
        }}
        onBlur={() => {
          onTitleChange(item, getFileTitleText(valueRef.current).trim());
          setFocused(false);
        }}
        onKeyDown={({ editor, event }) => {
          const key = event.key.toLowerCase();
          if (event.metaKey || event.ctrlKey) {
            if (key === 'z' || key === 'y') {
              event.preventDefault();
              if (key === 'y' || event.shiftKey) editor.redo();
              else editor.undo();
            } else if (['b', 'i', 'u', 's'].includes(key)) {
              event.preventDefault();
            }
          }
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        editableProps={{
          as: 'span',
          renderElement: FileTitleParagraph,
          className: 'govrs-file-listing-editor__title',
          'aria-multiline': 'false',
          'data-empty': getFileTitleText(value) === '',
          'data-placeholder': item.title,
        }}
      >
        <EditorReference onHasEditor={handleEditor} />
      </SlateEditor>
    </span>
  );
};

const FileListingEdit = ({ items = [], onTitleChange, onTitleFocus }) => {
  const previewRef = useRef(null);
  const [titleTargets, setTitleTargets] = useState([]);

  useEffect(() => {
    const targets = Array.from(
      previewRef.current.querySelectorAll('.govrs-list-file__content'),
    ).map((content) => {
      let target = content.querySelector(
        '.govrs-file-listing-editor__title-host',
      );
      if (!target) {
        target = document.createElement('span');
        target.className = 'govrs-file-listing-editor__title-host';
        content.prepend(target);
      }
      return target;
    });
    setTitleTargets((previous) =>
      previous.length === targets.length &&
      previous.every((target, index) => target === targets[index])
        ? previous
        : targets,
    );
  }, [items]);

  return (
    <div
      ref={previewRef}
      className="govrs-file-listing-editor"
      role="presentation"
      onClick={(event) => {
        if (event.target.closest('.govrs-list-file__anchor')) {
          event.preventDefault();
        }
      }}
    >
      <List
        variant="file"
        // The DS owns the icon and metadata. Portals supply only editable titles.
        items={items.map((item) => ({
          ...item,
          title: '',
          displayTitle: undefined,
        }))}
      />
      {titleTargets.map((target, index) => {
        const item = items[index];
        return item
          ? createPortal(
              <InlineFileTitle
                item={item}
                onTitleChange={onTitleChange}
                onTitleFocus={onTitleFocus}
              />,
              target,
              item.id || index,
            )
          : null;
      })}
    </div>
  );
};

export default FileListingEdit;
