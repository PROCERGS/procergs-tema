import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Accordion } from '@procergs/react-govrs-ds';
import { normalizeItems } from './normalizeItems';
import messages from './messages';

const AccordionBlockBody = ({ data }) => {
  const intl = useIntl();
  const items = normalizeItems(data.items);

  if (!items.length) {
    return (
      <div className="govrs-accordion-block__empty">
        <FormattedMessage {...messages.empty} />
      </div>
    );
  }

  return (
    <Accordion
      items={items}
      headline={data.headline || undefined}
      titleSize={data.titleSize || 'h3'}
      theme={data.theme || 'default'}
      rightArrows={data.rightArrows !== false}
      collapsed={data.collapsed !== false}
      nonExclusive={data.nonExclusive !== false}
      filtering={Boolean(data.filtering)}
      filterPlaceholder={
        data.filterPlaceholder ||
        intl.formatMessage(messages.filterPlaceholderDefault)
      }
      filterLabel={
        data.filterLabel || intl.formatMessage(messages.filterLabelDefault)
      }
      clearFilterLabel={
        data.clearFilterLabel ||
        intl.formatMessage(messages.clearFilterLabelDefault)
      }
      noResultsMessage={
        data.noResultsMessage ||
        intl.formatMessage(messages.noResultsMessageDefault)
      }
      className="govrs-accordion-block__accordion"
    />
  );
};

AccordionBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccordionBlockBody;
