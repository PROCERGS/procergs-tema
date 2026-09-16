import React from 'react';
import PropTypes from 'prop-types';
import { Divisor } from '@procergs/react-govrs-ds';
import { normalizeDivisor } from './normalizeDivisor';

const DivisorBlockBody = ({ data }) => <Divisor {...normalizeDivisor(data)} />;

DivisorBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DivisorBlockBody;
