import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getContent } from '@plone/volto/actions/content/content';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import View from '@plone/volto/components/theme/View/View';
import Search from './Search';

const SEARCH_PAGE_PATH = '/busca';

const isSearchPageContent = (content) =>
  content?.['@id'] && flattenToAppURL(content['@id']) === SEARCH_PAGE_PATH;

export class SearchPage extends Component {
  static propTypes = {
    content: PropTypes.shape({
      '@id': PropTypes.string,
    }),
    error: PropTypes.shape({
      status: PropTypes.number,
    }),
    getContent: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    content: null,
    error: null,
  };

  state = {
    requested: false,
  };

  componentDidMount() {
    if (!isSearchPageContent(this.props.content)) {
      this.setState({ requested: true });
      this.props.getContent(SEARCH_PAGE_PATH);
    }
  }

  render() {
    const { content, error, loading } = this.props;

    if (isSearchPageContent(content)) {
      return <View {...this.props} />;
    }

    if (error?.status === 404 && !loading) {
      return <Search {...this.props} />;
    }

    if (!this.state.requested || loading) {
      return null;
    }

    return <View {...this.props} />;
  }
}

export default connect(
  (state) => ({
    content: state.content.data,
    error: state.content.get.error,
    loading: state.content.get.loading,
  }),
  { getContent },
)(SearchPage);
