import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import toHexColor from '../helpers/toHexColor';

const ColorInputWidget = ({
  id,
  title,
  description,
  value,
  onChange,
  default: defaultValue,
}) => {
  const color = toHexColor(value, toHexColor(defaultValue, '#ffffff'));

  return (
    <Form.Field className="govrs-color-input-widget" id={`field-${id}`}>
      <label htmlFor={`color-input-${id}`}>{title}</label>
      {description ? <p className="help">{description}</p> : null}
      <div className="govrs-color-contrast-widget__custom">
        <label>
          <input
            id={`color-input-${id}`}
            type="color"
            value={color}
            onChange={(event) => onChange(id, event.target.value)}
          />
        </label>
      </div>
    </Form.Field>
  );
};

ColorInputWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  default: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
};

export default ColorInputWidget;
