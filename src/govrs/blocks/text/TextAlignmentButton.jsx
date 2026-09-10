import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Dropdown } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import ToolbarButton from '@plone/volto-slate/editor/ui/ToolbarButton';
import alignLeftSVG from '@plone/volto/icons/align-left.svg';
import alignCenterSVG from '@plone/volto/icons/align-center.svg';
import alignRightSVG from '@plone/volto/icons/align-right.svg';
import { normalizeTextAlignment } from './textAlignment';

const ALIGNMENT_OPTIONS = [
  {
    value: 'left',
    label: 'Alinhar à esquerda',
    icon: alignLeftSVG,
  },
  {
    value: 'center',
    label: 'Centralizar',
    icon: alignCenterSVG,
  },
  {
    value: 'right',
    label: 'Alinhar à direita',
    icon: alignRightSVG,
  },
];

const TextAlignmentButton = () => {
  const editor = useSlate();
  const [open, setOpen] = React.useState(false);
  const blockProps = editor.getBlockProps?.();
  const selectedAlignment = normalizeTextAlignment(
    blockProps?.data?.textAlignment,
  );
  const selectedOption =
    ALIGNMENT_OPTIONS.find(({ value }) => value === selectedAlignment) ||
    ALIGNMENT_OPTIONS[0];

  const applyAlignment = React.useCallback(
    (event, alignment) => {
      event.preventDefault();

      const currentBlockProps = editor.getBlockProps?.();
      if (!currentBlockProps?.block || !currentBlockProps?.onChangeBlock) {
        return;
      }

      currentBlockProps.onChangeBlock(currentBlockProps.block, {
        ...currentBlockProps.data,
        textAlignment: alignment,
      });
      ReactEditor.focus(editor);
      setOpen(false);
    },
    [editor],
  );

  if (!blockProps?.block || !blockProps?.onChangeBlock) {
    return null;
  }

  return (
    <Dropdown
      className="procergs-text-alignment-menu"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      pointing="top left"
      trigger={
        <ToolbarButton
          title="Alinhamento do texto"
          icon={selectedOption.icon}
          active={selectedAlignment !== 'left'}
          onMouseDown={(event) => event.preventDefault()}
        />
      }
    >
      <Dropdown.Menu>
        {ALIGNMENT_OPTIONS.map((option) => (
          <Dropdown.Item
            key={option.value}
            active={selectedAlignment === option.value}
            aria-label={option.label}
            onMouseDown={(event) => applyAlignment(event, option.value)}
          >
            <Icon name={option.icon} size="24px" />
            <span>{option.label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TextAlignmentButton;
