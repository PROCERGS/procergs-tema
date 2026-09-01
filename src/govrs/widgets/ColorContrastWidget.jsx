import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import { GOVRS_COLOR_PAIRS, getContrastRatio } from '../helpers/colorContrast';

const DEFAULT_PAIR = GOVRS_COLOR_PAIRS[0];

const ColorContrastWidget = ({ id, title, description, value, onChange }) => {
  const [draft, setDraft] = useState({
    background: value?.background || DEFAULT_PAIR.background,
    foreground: value?.foreground || DEFAULT_PAIR.foreground,
  });

  useEffect(() => {
    setDraft({
      background: value?.background || DEFAULT_PAIR.background,
      foreground: value?.foreground || DEFAULT_PAIR.foreground,
    });
  }, [value?.background, value?.foreground]);

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
              });
            }}
          >
            Aa
          </Button>
        ))}
      </div>

      <div className="govrs-color-contrast-widget__custom">
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
  }),
  onChange: PropTypes.func.isRequired,
};

export default ColorContrastWidget;
