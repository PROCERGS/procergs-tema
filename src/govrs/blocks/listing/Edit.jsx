import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import isEqual from 'lodash/isEqual';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import ListingBlockSchema from './schema';
import ListingBlockBody from './ListingBlockBody';
import {
  getListingVariation,
  listingNeedsFullObjects,
} from './getListingVariation';

const messages = defineMessages({
  listing: {
    id: 'Listing',
    defaultMessage: 'Listing',
  },
  results: {
    id: 'Results preview',
    defaultMessage: 'Results preview',
  },
  items: {
    id: 'Contained items',
    defaultMessage: 'Contained items',
  },
});

const Edit = React.memo(
  function ListingBlockEdit(props) {
    const {
      block,
      blocksErrors,
      onChangeBlock,
      data,
      selected,
      navRoot,
      contentType,
      pathname,
    } = props;
    const intl = useIntl();
    const schema = ListingBlockSchema({ ...props, data, intl });
    const placeholder =
      data.placeholder ||
      (data?.querystring?.query?.length
        ? intl.formatMessage(messages.results)
        : intl.formatMessage(messages.items));

    return (
      <div className={cx('block listing', getListingVariation(data))}>
        <p className="items-preview">{placeholder}</p>
        <ListingBlockBody
          {...props}
          data={data}
          path={getBaseUrl(pathname)}
          isEditMode
          variation={{
            ...props.variation,
            fullobjects: listingNeedsFullObjects(data),
          }}
        />
        {!selected && <div className="listing-overlay" />}
        <SidebarPortal selected={selected}>
          <BlockDataForm
            schema={schema}
            title={intl.formatMessage(messages.listing)}
            onChangeField={(id, value) => {
              onChangeBlock(block, {
                ...data,
                [id]: value,
              });
            }}
            onChangeBlock={onChangeBlock}
            formData={data}
            block={block}
            navRoot={navRoot}
            contentType={contentType}
            errors={blocksErrors}
          />
        </SidebarPortal>
      </div>
    );
  },
  (prevProps, nextProps) =>
    !(
      nextProps.index !== prevProps.index ||
      nextProps.selected !== prevProps.selected ||
      !isEqual(prevProps.data, nextProps.data)
    ),
);

Edit.propTypes = {
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  block: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default compose(withBlockExtensions)(Edit);
