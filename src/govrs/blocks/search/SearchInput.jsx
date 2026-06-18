import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import { Search } from '@procergs/react-govrs-ds';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

const SearchInput = ({
  id,
  data,
  searchText,
  setSearchText,
  isLive,
  onTriggerSearch,
}) => {
  const intl = useIntl();
  const placeholder =
    data.searchInputPrompt || intl.formatMessage(messages.search);
  const searchLabel = intl.formatMessage(messages.search);

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchText(value);

    if (!value) {
      onTriggerSearch('');
      return;
    }

    if (isLive) {
      onTriggerSearch(value);
    }
  };

  const handleSearch = (value) => {
    onTriggerSearch(value ? value : '');
  };

  return (
    <div className="search-input govrs-search-block-wrapper">
      <Search
        id={`${id}-searchtext`}
        name="SearchableText"
        value={searchText}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder={placeholder}
        inputAriaLabel={searchLabel}
        searchButtonLabel={searchLabel}
        fullWidth
        collapsible={false}
      />
    </div>
  );
};

SearchInput.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    searchInputPrompt: PropTypes.string,
  }).isRequired,
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
  isLive: PropTypes.bool.isRequired,
  onTriggerSearch: PropTypes.func.isRequired,
};

export default SearchInput;
