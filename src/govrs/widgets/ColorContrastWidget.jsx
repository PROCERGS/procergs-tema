import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import {
  GOVRS_COLOR_PAIRS,
  clampOpacity,
  getContrastRatio,
  getContrastRatioWithOpacity,
  hexToRgba,
} from '../helpers/colorContrast';

const DEFAULT_PAIR = GOVRS_COLOR_PAIRS[0];
const OPACITY_PRESETS = [
  { opacity: 0, text: '0%', title: 'Transparente' },
  { opacity: 0.5, text: '50%' },
  { opacity: 1, text: '100%', title: 'Sólido' },
];

const percentFromOpacity = (opacity) =>
  Math.round(clampOpacity(opacity, 1) * 100);

const getDraftColors = ({
  value,
  defaultValue,
  showBorder,
  showOpacity,
  legacyBorderColor,
  inheritedBackgroundOpacity,
  inheritedBorderOpacity,
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
    ...(showOpacity && {
      backgroundOpacity: clampOpacity(
        value?.backgroundOpacity,
        clampOpacity(
          inheritedBackgroundOpacity,
          clampOpacity(defaultValue?.backgroundOpacity, 1),
        ),
      ),
      ...(showBorder && {
        borderOpacity: clampOpacity(
          value?.borderOpacity,
          clampOpacity(
            inheritedBorderOpacity,
            clampOpacity(defaultValue?.borderOpacity, 1),
          ),
        ),
      }),
    }),
  };
};

const OpacityField = ({ id, label, value, onChange }) => {
  const percent = percentFromOpacity(value);

  const setPercent = (nextPercent) => {
    const clamped = Math.min(100, Math.max(0, Number(nextPercent)));
    onChange(Number.isFinite(clamped) ? clamped / 100 : 1);
  };

  return (
    <div className="govrs-color-contrast-widget__opacity">
      <div className="govrs-color-contrast-widget__opacity-header">
        <label htmlFor={`${id}-range`}>{label}</label>
        <output
          className="govrs-color-contrast-widget__opacity-value"
          htmlFor={`${id}-range`}
          aria-live="polite"
        >
          {percent}%
        </output>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min="0"
        max="100"
        step="1"
        value={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent} por cento`}
        onChange={(event) => setPercent(event.target.value)}
      />
      <div
        className="govrs-color-contrast-widget__opacity-presets"
        role="group"
        aria-label={`Atalhos de ${label.toLowerCase()}`}
      >
        {OPACITY_PRESETS.map((preset) => (
          <button
            key={preset.text}
            type="button"
            title={preset.title || `${preset.text} de opacidade`}
            className={`govrs-color-contrast-widget__opacity-preset${
              percent === Math.round(preset.opacity * 100) ? ' is-active' : ''
            }`}
            aria-pressed={percent === Math.round(preset.opacity * 100)}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange(preset.opacity);
            }}
          >
            {preset.text}
            {preset.title ? <small>{preset.title}</small> : null}
          </button>
        ))}
      </div>
    </div>
  );
};

OpacityField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

const ColorContrastWidget = ({
  id,
  title,
  description,
  value,
  onChange,
  default: defaultValue,
  showBorder = false,
  showOpacity = false,
  legacyBorderColor,
  inheritedBackgroundOpacity,
  inheritedBorderOpacity,
}) => {
  const draft = getDraftColors({
    value,
    defaultValue,
    showBorder,
    showOpacity,
    legacyBorderColor,
    inheritedBackgroundOpacity,
    inheritedBorderOpacity,
  });
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const backgroundOpacity = showOpacity ? (draft.backgroundOpacity ?? 1) : 1;
  const borderOpacity = showOpacity ? (draft.borderOpacity ?? 1) : 1;
  const contrast = useMemo(() => {
    if (showOpacity && backgroundOpacity < 0.01) {
      return null;
    }

    if (showOpacity && backgroundOpacity < 0.999) {
      return getContrastRatioWithOpacity(
        draft.background,
        draft.foreground,
        backgroundOpacity,
      );
    }

    return getContrastRatio(draft.background, draft.foreground);
  }, [backgroundOpacity, draft.background, draft.foreground, showOpacity]);
  const isValid = contrast === null ? true : contrast >= 4.5;

  const commit = (next) => {
    draftRef.current = next;
    onChange(id, next);
  };

  const commitPatch = (patch) => commit({ ...draftRef.current, ...patch });

  const contrastMessage =
    contrast === null
      ? 'Fundo transparente: o contraste do texto depende da cor atrás do botão.'
      : `Contraste ${contrast.toFixed(2)}:1 ${
          isValid ? '(AA)' : '(abaixo do nível AA recomendado)'
        }${
          showOpacity && backgroundOpacity < 0.999
            ? ' — medido sobre fundo branco; a cor atrás do botão pode alterar o resultado.'
            : ''
        }`;

  return (
    <Form.Field className="govrs-color-contrast-widget" id={`field-${id}`}>
      <label>{title}</label>
      {description ? <p className="help">{description}</p> : null}

      <div
        className="govrs-color-contrast-widget__presets"
        role="group"
        aria-label="Presets de cores"
      >
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
              commit({
                background: pair.background,
                foreground: pair.foreground,
                ...(showBorder && {
                  border: pair.border || pair.background,
                }),
                ...(showOpacity && {
                  backgroundOpacity: 1,
                  ...(showBorder && {
                    borderOpacity: 1,
                  }),
                }),
              });
            }}
          >
            Aa
          </Button>
        ))}
      </div>

      {showOpacity ? (
        <div className="govrs-color-contrast-widget__preview">
          <span className="govrs-color-contrast-widget__preview-label">
            Prévia
          </span>
          <span
            className="govrs-color-contrast-widget__preview-swatch"
            aria-label="Prévia da aparência do botão"
            style={{
              backgroundColor: hexToRgba(draft.background, backgroundOpacity),
              color: draft.foreground,
              borderColor: hexToRgba(
                draft.border || draft.background,
                borderOpacity,
              ),
            }}
          >
            Exemplo
          </span>
        </div>
      ) : null}

      <div
        className={`govrs-color-contrast-widget__custom${
          showBorder || showOpacity
            ? ' govrs-color-contrast-widget__custom--vertical'
            : ''
        }`}
      >
        <div className="govrs-color-contrast-widget__swatch">
          <label>
            Fundo
            <input
              type="color"
              value={draft.background}
              onChange={(event) =>
                commitPatch({ background: event.target.value })
              }
            />
          </label>
          {showOpacity ? (
            <OpacityField
              id={`${id}-background-opacity`}
              label="Opacidade do fundo"
              value={backgroundOpacity}
              onChange={(nextOpacity) =>
                commitPatch({ backgroundOpacity: nextOpacity })
              }
            />
          ) : null}
        </div>
        <label>
          Texto
          <input
            type="color"
            value={draft.foreground}
            onChange={(event) =>
              commitPatch({ foreground: event.target.value })
            }
          />
        </label>
        {showBorder ? (
          <div className="govrs-color-contrast-widget__swatch">
            <label>
              Borda
              <input
                type="color"
                value={draft.border}
                onChange={(event) =>
                  commitPatch({ border: event.target.value })
                }
              />
            </label>
            {showOpacity ? (
              <OpacityField
                id={`${id}-border-opacity`}
                label="Opacidade da borda"
                value={borderOpacity}
                onChange={(nextOpacity) =>
                  commitPatch({ borderOpacity: nextOpacity })
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <Message
        size="tiny"
        info={contrast === null}
        positive={contrast !== null && isValid}
        negative={contrast !== null && !isValid}
        content={contrastMessage}
      />
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
    backgroundOpacity: PropTypes.number,
    borderOpacity: PropTypes.number,
  }),
  default: PropTypes.shape({
    background: PropTypes.string,
    foreground: PropTypes.string,
    border: PropTypes.string,
    backgroundOpacity: PropTypes.number,
    borderOpacity: PropTypes.number,
  }),
  showBorder: PropTypes.bool,
  showOpacity: PropTypes.bool,
  inheritedBackgroundOpacity: PropTypes.number,
  inheritedBorderOpacity: PropTypes.number,
  legacyBorderColor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ColorContrastWidget;
