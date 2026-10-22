import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Tag } from '@procergs/react-govrs-ds';

import { getVocabulary } from '@plone/volto/actions/vocabularies/vocabularies';

const vocabulary = 'plone.app.vocabularies.Keywords';

const SearchTags = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const activeSubject = new URLSearchParams(location.search).get('Subject');
  const getTagLocation = (tag, selected) => {
    const searchParams = new URLSearchParams(location.search);
    if (selected) {
      searchParams.set('Subject', tag);
    } else {
      searchParams.delete('Subject');
    }

    const search = searchParams.toString();
    return {
      pathname: '/busca',
      search: search ? `?${search}` : '',
    };
  };

  useEffect(() => {
    dispatch(getVocabulary({ vocabNameOrURL: vocabulary }));
  }, [dispatch]);

  const items = useSelector(
    (state) =>
      state.vocabularies[vocabulary] && state.vocabularies[vocabulary].items
        ? state.vocabularies[vocabulary].items
        : [],
    shallowEqual,
  );

  return items && items.length > 0 ? (
    <div className="search-tags">
      {items.map((item) => {
        const isActive = activeSubject === item.label;

        return (
          <Tag
            key={item.label}
            label={item.label}
            showIcon={false}
            selected={isActive}
            onSelectedChange={(selected) =>
              history.push(getTagLocation(item.label, selected))
            }
          />
        );
      })}
    </div>
  ) : (
    <span />
  );
};

export default SearchTags;
