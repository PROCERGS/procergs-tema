import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import { GOVRS_COLOR_PAIRS, getContrastRatio } from '../helpers/colorContrast';

const DEFAULT_PAIR = GOVRS_COLOR_PAIRS[0];

const getDraftColors = ({
  value,
  defaultValue,
  showBorder,
  legacyBorderColor,
}) => {
  const background =
    value?.background || defaultValue?.background || DEFAULT_PAIR.background;
  const foreground =
    value?.foreground || defaultValue?.foreground || DEFAULT_PAIR.foreground;

  return {
    background,
    foreground,
    ...(showBorder && {
      border:
        value?.border ||
        legacyBorderColor ||
        (value?.background ? background : defaultValue?.border) ||
        background,
    }),
  };
};

const ColorContrastWidget = ({
  id,
  title,
  description,
  value,
  onChange,
  default: defaultValue,
  showBorder = false,
  legacyBorderColor,
}) => {
  const [draft, setDraft] = useState(() =>
    getDraftColors({ value, defaultValue, showBorder, legacyBorderColor }),
  );

  useEffect(() => {
    setDraft(
      getDraftColors({ value, defaultValue, showBorder, legacyBorderColor }),
    );
  }, [value, defaultValue, showBorder, legacyBorderColor]);

  const contrast = useMemo(
    () => getContrastRatio(draft.background, draft.foreground),
    [draft.background, draft.foreground],
  );
  const isValid = contrast >= 4.5;

  return (
    <Form.Field className="govrs-color-contrast-widget" id={`field-${id}`}>
      <label>{title}</label>
      {description ? <p className="help">{description}</p> : null}

      <div className="govrs-color-contrast-widget__presets">
        {GOVRS_COLOR_PAIRS.map((pair) => (
          <Button
            key={pair.name}
            type="button"
            title={pair.label}
            aria-label={pair.label}
            circular
            style={{
              backgroundColor: pair.background,
              color: pair.foreground,
              border: '1px solid #777777',
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange(id, {
                background: pair.background,
                foreground: pair.foreground,
                ...(showBorder && {
                  border: pair.border || pair.background,
                }),
              });
            }}
          >
            Aa
          </Button>
        ))}
      </div>

      <div
        className={`govrs-color-contrast-widget__custom${
          showBorder ? ' govrs-color-contrast-widget__custom--vertical' : ''
        }`}
      >
        <label>
          Fundo
          <input
            type="color"
            value={draft.background}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                background: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Texto
          <input
            type="color"
            value={draft.foreground}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                foreground: event.target.value,
              }))
            }
          />
        </label>
        {showBorder ? (
          <label>
            Borda
            <input
              type="color"
              value={draft.border}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  border: event.target.value,
                }))
              }
            />
          </label>
        ) : null}
      </div>

      <Message
        size="tiny"
        positive={isValid}
        negative={!isValid}
        content={`Contraste ${contrast.toFixed(2)}:1 ${
          isValid ? '(AA)' : '(abaixo do nível AA recomendado)'
        }`}
      />

      <Button
        type="button"
        size="small"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onChange(id, draft);
        }}
      >
        Aplicar cores
      </Button>
    </Form.Field>
  );
};

ColorContrastWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.shape({
    background: PropTypes.string,
    foreground: PropTypes.string,
    border: PropTypes.string,
  }),
  default: PropTypes.shape({
    background: PropTypes.string,
    foreground: PropTypes.string,
    border: PropTypes.string,
  }),
  showBorder: PropTypes.bool,
  legacyBorderColor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ColorContrastWidget;
