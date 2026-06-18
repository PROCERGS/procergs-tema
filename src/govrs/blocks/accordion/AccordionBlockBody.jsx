import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@procergs/react-govrs-ds';
import { normalizeItems } from './normalizeItems';

const AccordionBlockBody = ({ data }) => {
  const items = normalizeItems(data.items);

  if (!items.length) {
    return (
      <div className="govrs-accordion-block__empty">
        <FormattedMessage
          id="No accordion panels configured"
          defaultMessage="No accordion panels configured"
        />
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
      filterPlaceholder={data.filterPlaceholder || 'Digite para filtrar...'}
      filterLabel={data.filterLabel || 'Filtrar painéis do accordion'}
      clearFilterLabel={data.clearFilterLabel || 'Limpar filtro'}
      noResultsMessage={
        data.noResultsMessage ||
        'Nenhum painel corresponde ao filtro informado.'
      }
      className="govrs-accordion-block__accordion"
    />
  );
};

AccordionBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccordionBlockBody;
