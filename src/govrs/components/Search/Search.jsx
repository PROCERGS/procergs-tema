/**
 * Search component.
 * @module components/theme/Search/Search
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { asyncConnect } from '@plone/volto/helpers/AsyncConnect';
import { FormattedMessage } from 'react-intl';
import { createPortal } from 'react-dom';
import { Container, Button, Header } from 'semantic-ui-react';
import qs from 'query-string';
import classNames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import config from '@plone/volto/registry';
import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import { searchContent } from '@plone/volto/actions/search/search';
import SearchTags from '@plone/volto/components/theme/Search/SearchTags';
import Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
import Pagination from '../Pagination/Pagination';

const messages = defineMessages({
  Search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

class Search extends Component {
  static propTypes = {
    searchContent: PropTypes.func.isRequired,
    searchableText: PropTypes.string,
    subject: PropTypes.string,
    path: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    pathname: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: [],
    searchableText: null,
    subject: null,
    path: null,
  };

  constructor(props) {
    super(props);
    this.defaultPageSize = config.settings.defaultPageSize;
    this.state = { currentPage: 1, isClient: false, active: 'relevance' };
  }

  componentDidMount() {
    this.doSearch();
    this.setState({ isClient: true });
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.location.search !== nextProps.location.search) {
      this.doSearch();
    }
  };

  doSearch = () => {
    const options = qs.parse(this.props.history.location.search);
    this.setState({ currentPage: 1 });
    options['use_site_search_settings'] = 1;
    this.props.searchContent('', {
      b_size: this.defaultPageSize,
      ...options,
    });
  };

  handleQueryPaginationChange = (page) => {
    window.scrollTo(0, 0);
    const options = qs.parse(this.props.history.location.search);
    options['use_site_search_settings'] = 1;

    this.setState({ currentPage: page }, () => {
      this.props.searchContent('', {
        b_size: this.defaultPageSize,
        ...options,
        b_start:
          (this.state.currentPage - 1) *
          (options.b_size || this.defaultPageSize),
      });
    });
  };

  onSortChange = (event, sort_order) => {
    const options = qs.parse(this.props.history.location.search);
    options.sort_on = event.target.name;
    options.sort_order = sort_order || 'ascending';
    if (event.target.name === 'relevance') {
      delete options.sort_on;
      delete options.sort_order;
    }
    const searchParams = qs.stringify(options);
    this.setState({ currentPage: 1, active: event.target.name }, () => {
      this.props.history.replace({
        search: searchParams,
      });
    });
  };

  render() {
    const options = qs.parse(this.props.history.location.search);
    const pageSize = Number(options.b_size) || this.defaultPageSize;
    const totalItems = this.props.search?.total || 0;

    return (
      <Container id="page-search">
        <Helmet title={this.props.intl.formatMessage(messages.Search)} />
        <div className="container">
          <article id="content">
            <header>
              <h1 className="documentFirstHeading">
                {this.props.searchableText ? (
                  <FormattedMessage
                    id="Search results for {term}"
                    defaultMessage="Search results for {term}"
                    values={{
                      term: <q>{this.props.searchableText}</q>,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="Search results"
                    defaultMessage="Search results"
                  />
                )}
              </h1>

              <SearchTags />

              {totalItems > 0 ? (
                <div className="items_total">
                  {totalItems}{' '}
                  <FormattedMessage
                    id="results found"
                    defaultMessage="results"
                  />
                  <Header>
                    <Header.Content className="header-content">
                      <div className="sort-by">
                        <FormattedMessage
                          id="Sort By:"
                          defaultMessage="Sort by:"
                        />
                      </div>
                      <Button
                        onClick={(event) => {
                          this.onSortChange(event);
                        }}
                        name="relevance"
                        size="tiny"
                        className={classNames('button-sort', {
                          'button-active': this.state.active === 'relevance',
                        })}
                      >
                        <FormattedMessage
                          id="Relevance"
                          defaultMessage="Relevance"
                        />
                      </Button>
                      <Button
                        onClick={(event) => {
                          this.onSortChange(event);
                        }}
                        name="sortable_title"
                        size="tiny"
                        className={classNames('button-sort', {
                          'button-active':
                            this.state.active === 'sortable_title',
                        })}
                      >
                        <FormattedMessage
                          id="Alphabetically"
                          defaultMessage="Alphabetically"
                        />
                      </Button>
                      <Button
                        onClick={(event) => {
                          this.onSortChange(event, 'reverse');
                        }}
                        name="effective"
                        size="tiny"
                        className={classNames('button-sort', {
                          'button-active': this.state.active === 'effective',
                        })}
                      >
                        <FormattedMessage
                          id="Date (newest first)"
                          defaultMessage="Date (newest first)"
                        />
                      </Button>
                    </Header.Content>
                  </Header>
                </div>
              ) : (
                <div>
                  <FormattedMessage
                    id="No results found"
                    defaultMessage="No results found"
                  />
                </div>
              )}
            </header>
            <section id="content-core">
              {this.props.items.map((item) => (
                <article className="tileItem" key={item['@id']}>
                  <h2 className="tileHeadline">
                    <UniversalLink
                      item={item}
                      className="summary url"
                      title={item['@type']}
                    >
                      {item.title}
                    </UniversalLink>
                  </h2>
                  {item.description && (
                    <div className="tileBody">
                      <span className="description">{item.description}</span>
                    </div>
                  )}
                  <div className="tileFooter">
                    <UniversalLink item={item}>
                      <FormattedMessage
                        id="Read More…"
                        defaultMessage="Read More…"
                      />
                    </UniversalLink>
                  </div>
                  <div className="visualClear" />
                </article>
              ))}

              <div className="search-footer">
                <Pagination
                  page={this.state.currentPage}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={this.handleQueryPaginationChange}
                />
              </div>
            </section>
          </article>
        </div>
        {this.state.isClient &&
          createPortal(
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={<span />}
            />,
            document.getElementById('toolbar'),
          )}
      </Container>
    );
  }
}

const mapSearchState = (state, props) => ({
  items: state.search.items,
  search: state.search,
  searchableText: qs.parse(props.history.location.search).SearchableText,
  pathname: props.history.location.pathname,
});

export const __test__ = compose(
  injectIntl,
  connect(mapSearchState, { searchContent }),
)(Search);

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      items: state.search.items,
      search: state.search,
      searchableText: qs.parse(props.history.location.search).SearchableText,
      pathname: props.location.pathname,
    }),
    { searchContent },
  ),
  asyncConnect([
    {
      key: 'search',
      promise: ({ location, store: { dispatch } }) =>
        dispatch(
          searchContent('', {
            ...qs.parse(location.search),
            use_site_search_settings: 1,
          }),
        ),
    },
  ]),
)(Search);
