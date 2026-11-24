import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import SearchPage from '../govrs/components/Search/SearchPage';

const LegacySearchRedirect = ({ location }) =>
  React.createElement(Redirect, {
    to: {
      pathname: '/busca',
      search: location.search,
    },
  });

LegacySearchRedirect.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

const configureSearch = (config) => {
  config.addonRoutes = [
    ...(config.addonRoutes || []),
    {
      path: '/busca',
      exact: true,
      component: SearchPage,
    },
    {
      path: '/search',
      exact: true,
      component: LegacySearchRedirect,
    },
  ];

  return config;
};

export default configureSearch;
