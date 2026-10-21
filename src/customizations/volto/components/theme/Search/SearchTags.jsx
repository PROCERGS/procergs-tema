import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Tag } from '@procergs/react-govrs-ds';

import { getVocabulary } from '@plone/volto/actions/vocabularies/vocabularies';

const vocabulary = 'plone.app.vocabularies.Keywords';

const SearchTags = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const activeSubject = new URLSearchParams(location.search).get('Subject');
  const getTagLocation = (tag, isActive) => {
    const searchParams = new URLSearchParams(location.search);
    if (isActive) {
      searchParams.delete('Subject');
    } else {
      searchParams.set('Subject', tag);
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
          <Link
            className="search-tags__link"
            to={getTagLocation(item.label, isActive)}
            key={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Tag
              label={item.label}
              showIcon={false}
              showButton={false}
              selected={isActive}
            />
          </Link>
        );
      })}
    </div>
  ) : (
    <span />
  );
};

export default SearchTags;
