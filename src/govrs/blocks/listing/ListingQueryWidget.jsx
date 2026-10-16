import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getQuerystring } from '@plone/volto/actions/querystring/querystring';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import QuerystringWidget from '@plone/volto/components/manage/Widgets/QuerystringWidget';
import { QuerystringWidgetComponent } from '@plone/volto/components/manage/Widgets/QueryWidget';
import { getListingQueryIndexes } from './fileCriteria';

const ListingQueryWidget = compose(
  injectIntl,
  injectLazyLibs(['reactSelect']),
  connect(
    (state, props) => ({
      indexes: getListingQueryIndexes(
        state.querystring.indexes,
        props.isFileListing,
      ),
    }),
    { getQuerystring },
  ),
)(QuerystringWidgetComponent);

export const ListingQuerystringWidget = (props) => (
  <QuerystringWidget
    {...props}
    schemaEnhancer={({ schema }) => ({
      ...schema,
      properties: {
        ...schema.properties,
        query: {
          ...schema.properties.query,
          widget: 'listing_query',
          isFileListing: props.isFileListing,
        },
      },
    })}
  />
);

export default ListingQueryWidget;
