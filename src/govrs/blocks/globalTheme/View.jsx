import React from 'react';
import PropTypes from 'prop-types';
import { createSiteThemeCss } from './themeColors';

const ThemeBlockView = ({ data }) => (
  <style
    data-procergs-site-theme
    dangerouslySetInnerHTML={{ __html: createSiteThemeCss(data) }}
  />
);

ThemeBlockView.propTypes = {
  data: PropTypes.object,
};

export default ThemeBlockView;
