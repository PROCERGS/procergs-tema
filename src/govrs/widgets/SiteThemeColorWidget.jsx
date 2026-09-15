import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'semantic-ui-react';
import { normalizeHexColor } from '../blocks/globalTheme/themeColors';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const SiteThemeColorWidget = ({
  id,
  title,
  description,
  value,
  onChange,
  default: defaultValue,
  error,
}) => {
  const fallback = normalizeHexColor(defaultValue, '#000000');
  const color = normalizeHexColor(value, fallback);
  const [draft, setDraft] = useState(color);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setDraft(color);
    setInvalid(false);
  }, [color]);

  const commit = (nextValue) => {
    const requested = nextValue.trim();
    const withHash = requested.startsWith('#') ? requested : `#${requested}`;

    if (!HEX_COLOR.test(withHash)) {
      setInvalid(true);
      return;
    }

    const normalized = normalizeHexColor(withHash, fallback);
    setDraft(normalized);
    setInvalid(false);
    onChange(id, normalized);
  };

  const restoreDefault = () => {
    setDraft(fallback);
    setInvalid(false);
    onChange(id, fallback);
  };

  return (
    <Form.Field
      className="govrs-site-theme-color-widget"
      id={`field-${id}`}
      error={Boolean(error) || invalid}
    >
      <label htmlFor={`site-theme-hex-${id}`}>{title}</label>
      {description ? <p className="help">{description}</p> : null}
      <div className="govrs-site-theme-color-widget__control">
        <label
          className="govrs-site-theme-color-widget__swatch"
          title={`Selecionar ${title}`}
        >
          <span
            className="govrs-site-theme-color-widget__swatch-preview"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <input
            id={`site-theme-color-${id}`}
            type="color"
            aria-label={`Selecionar ${title}`}
            value={color}
            onChange={(event) => commit(event.target.value)}
          />
        </label>
        <Input
          fluid
          id={`site-theme-hex-${id}`}
          aria-label={`${title} em hexadecimal`}
          value={draft}
          maxLength={7}
          spellCheck={false}
          onChange={(event, input) => {
            setDraft(input.value.toUpperCase());
            setInvalid(false);
          }}
          onBlur={() => commit(draft)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit(draft);
            }
          }}
        />
        <Button
          type="button"
          className="govrs-site-theme-color-widget__default"
          onClick={restoreDefault}
          aria-label={`Restaurar padrão de ${title}`}
        >
          Padrão
        </Button>
      </div>
      {invalid && (
        <p className="govrs-site-theme-color-widget__error" role="alert">
          Informe uma cor no formato #RRGGBB.
        </p>
      )}
    </Form.Field>
  );
};

SiteThemeColorWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.string,
  default: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
};

export default SiteThemeColorWidget;
