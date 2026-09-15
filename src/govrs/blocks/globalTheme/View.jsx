import React from 'react';
import PropTypes from 'prop-types';
import { createSiteThemeCss } from './themeColors';

const ThemeBlockView = ({ data }) => (
  <style data-procergs-site-theme>{createSiteThemeCss(data)}</style>
);

ThemeBlockView.propTypes = {
  data: PropTypes.object,
};

export default ThemeBlockView;
