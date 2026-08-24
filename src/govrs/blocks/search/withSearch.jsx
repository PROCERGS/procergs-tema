import React from 'react';
import { useSelector } from 'react-redux';
import qs from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';

import { resolveExtension } from '@plone/volto/helpers/Extensions/withBlockExtensions';
import config from '@plone/volto/registry';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';
import isEqual from 'lodash/isEqual';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const SEARCH_ENDPOINT_FIELDS = [
  'SearchableText',
  'b_size',
  'limit',
  'sort_on',
  'sort_order',
  'depth',
];

const PAQO = 'plone.app.querystring.operation';

function getInitialState(
  data,
  facets,
  urlSearchText,
  id,
  sortOnParam,
  sortOrderParam,
) {
  const { types: facetWidgetTypes } =
    config.blocks.blocksConfig.search.extensions.facetWidgets;
  const facetSettings = data?.facets || [];

  return {
    query: [
      ...(data.query?.query || []),
      ...(facetSettings || [])
        .map((facet) => {
          if (!facet?.field) return null;

          const { valueToQuery } = resolveExtension(
            'type',
            facetWidgetTypes,
            facet,
          );

          const name = facet.field.value;
          const value = facets[name];

          return valueToQuery({ value, facet });
        })
        .filter((f) => !!f),
      ...(urlSearchText
        ? [
            {
              i: 'SearchableText',
              o: 'plone.app.querystring.operation.string.contains',
              v: urlSearchText,
            },
          ]
        : []),
    ],
    sort_on: sortOnParam || data.query?.sort_on,
    sort_order: sortOrderParam || data.query?.sort_order,
    b_size: data.query?.b_size,
    limit: data.query?.limit,
    depth: data.query?.depth,
    block: id,
  };
}

function normalizeState({
  query,
  facets,
  id,
  searchText,
  sortOn,
  sortOrder,
  facetSettings,
}) {
  const { types: facetWidgetTypes } =
    config.blocks.blocksConfig.search.extensions.facetWidgets;

  const configuredFacets = facetSettings
    ? facetSettings.map((facet) => facet?.field?.value)
    : [];

  let copyOfQuery = query.query ? [...query.query] : [];

  const queryWithoutFacet = copyOfQuery.filter((query) => {
    return !configuredFacets.includes(query.i);
  });

  const params = {
    query: [
      ...(queryWithoutFacet || []),
      ...(facetSettings || []).map((facet) => {
        if (!facet?.field) return null;

        const { valueToQuery } = resolveExtension(
          'type',
          facetWidgetTypes,
          facet,
        );

        const name = facet.field.value;
        const value = facets[name];

        return valueToQuery({ value, facet });
      }),
    ].filter((o) => !!o),
    sort_on: sortOn || query.sort_on,
    sort_order: sortOrder || query.sort_order,
    b_size: query.b_size,
    limit: query.limit,
    depth: query.depth,
    block: id,
  };

  if (searchText) {
    params.query = params.query.reduce(
      (acc, kvp) => (kvp.i === 'SearchableText' ? acc : [...acc, kvp]),
      [],
    );
    params.query.push({
      i: 'SearchableText',
      o: 'plone.app.querystring.operation.string.contains',
      v: searchText,
    });
  }

  return params;
}

const getSearchFields = (searchData) => {
  return Object.assign(
    {},
    ...SEARCH_ENDPOINT_FIELDS.map((k) => {
      return searchData[k] ? { [k]: searchData[k] } : {};
    }),
    searchData.query ? { query: serializeQuery(searchData['query']) } : {},
  );
};

const useHashState = () => {
  const location = useLocation();
  const history = useHistory();

  const oldState = React.useMemo(() => {
    return {
      ...qs.parse(location.search),
      ...qs.parse(location.hash),
    };
  }, [location.hash, location.search]);

  const current = Object.assign(
    {},
    ...Array.from(Object.keys(oldState)).map((k) => ({ [k]: oldState[k] })),
  );

  const setSearchData = React.useCallback(
    (searchData) => {
      const newParams = qs.parse(location.search);

      let changed = false;

      Object.keys(searchData)
        .sort()
        .forEach((k) => {
          if (searchData[k]) {
            newParams[k] = searchData[k];
            if (oldState[k] !== searchData[k]) {
              changed = true;
            }
          }
        });

      SEARCH_ENDPOINT_FIELDS.forEach((k) => {
        if (!searchData[k] && newParams[k]) {
          delete newParams[k];
          changed = true;
        }
      });

      if (changed) {
        history.push({
          search: qs.stringify(newParams),
        });
      }
    },
    [history, oldState, location.search],
  );

  return [current, setSearchData];
};

const useSearchBlockState = (uniqueId, isEditMode) => {
  const [hashState, setHashState] = useHashState();
  const [internalState, setInternalState] = React.useState({});

  return isEditMode
    ? [internalState, setInternalState]
    : [hashState, setHashState];
};

const deserializeQuery = (q) => {
  return JSON.parse(q)?.map((kvp) => ({
    ...kvp,
    o: kvp.o.replace(/^paqo/, PAQO),
  }));
};
const serializeQuery = (q) => {
  return JSON.stringify(
    q?.map((kvp) => ({ ...kvp, o: kvp.o.replace(PAQO, 'paqo') })),
  );
};

const withSearch = (options) => (WrappedComponent) => {
  const { inputDelay = 1000 } = options || {};

  function WithSearch(props) {
    const { data, id, editable = false } = props;

    const [locationSearchData, setLocationSearchData] = useSearchBlockState(
      id,
      editable,
    );

    const urlQuery = locationSearchData.query
      ? deserializeQuery(locationSearchData.query)
      : [];
    const urlSearchText =
      locationSearchData.SearchableText ||
      urlQuery.find(({ i }) => i === 'SearchableText')?.v ||
      '';

    const [searchText, setSearchText] = React.useState(urlSearchText);

    const configuredFacets =
      data.facets?.map((facet) => facet?.field?.value) || [];

    const queryData = data?.query?.query
      ? deserializeQuery(JSON.stringify(data?.query?.query))
      : [];

    let intializeFacetWithQueryValue = [];

    for (let value of configuredFacets) {
      const queryString = queryData.find((item) => item.i === value);
      if (queryString) {
        intializeFacetWithQueryValue = [
          ...intializeFacetWithQueryValue,
          { [queryString.i]: queryString.v },
        ];
      }
    }

    const multiFacets = data.facets
      ?.filter((facet) => facet?.multiple)
      .map((facet) => facet?.field?.value);
    const [facets, setFacets] = React.useState(
      Object.assign(
        {},
        ...urlQuery.map(({ i, v }) => ({ [i]: v })),

        ...intializeFacetWithQueryValue,

        ...configuredFacets.map((f) =>
          locationSearchData[f]
            ? {
                [f]:
                  multiFacets.indexOf(f) > -1
                    ? [locationSearchData[f]]
                    : locationSearchData[f],
              }
            : {},
        ),
      ),
    );
    const previousUrlQuery = usePrevious(urlQuery);

    const preventOverrideOfFacetState =
      previousUrlQuery === undefined && urlQuery.length === 0;

    React.useEffect(() => {
      if (
        !isEqual(urlQuery, previousUrlQuery) &&
        !preventOverrideOfFacetState
      ) {
        setFacets(
          Object.assign(
            {},
            ...urlQuery.map(({ i, v }) => ({ [i]: v })),

            ...configuredFacets.map((f) =>
              locationSearchData[f]
                ? {
                    [f]:
                      multiFacets.indexOf(f) > -1
                        ? [locationSearchData[f]]
                        : locationSearchData[f],
                  }
                : {},
            ),
          ),
        );
      }
    }, [
      urlQuery,
      configuredFacets,
      locationSearchData,
      multiFacets,
      previousUrlQuery,
      preventOverrideOfFacetState,
    ]);

    const [sortOn, setSortOn] = React.useState(data?.query?.sort_on);
    const [sortOrder, setSortOrder] = React.useState(data?.query?.sort_order);

    const [searchData, setSearchData] = React.useState(
      getInitialState(data, facets, urlSearchText, id),
    );

    const deepFacets = JSON.stringify(facets);
    const deepData = JSON.stringify(data);
    React.useEffect(() => {
      setSearchData(
        getInitialState(
          JSON.parse(deepData),
          JSON.parse(deepFacets),
          urlSearchText,
          id,
          sortOn,
          sortOrder,
        ),
      );
    }, [deepData, deepFacets, urlSearchText, id, sortOn, sortOrder]);

    const timeoutRef = React.useRef();
    const facetSettings = data?.facets;

    const deepQuery = JSON.stringify(data.query);
    const onTriggerSearch = React.useCallback(
      (
        toSearchText = undefined,
        toSearchFacets = undefined,
        toSortOn = undefined,
        toSortOrder = undefined,
      ) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const runSearch = () => {
          const newSearchData = normalizeState({
            id,
            query: data.query || {},
            facets: toSearchFacets || facets,
            searchText: toSearchText ? toSearchText.trim() : '',
            sortOn: toSortOn || undefined,
            sortOrder: toSortOrder || sortOrder,
            facetSettings,
          });
          if (toSearchFacets) setFacets(toSearchFacets);
          if (toSortOn) setSortOn(toSortOn || undefined);
          if (toSortOrder) setSortOrder(toSortOrder);
          setSearchData(newSearchData);
          setLocationSearchData(getSearchFields(newSearchData));
        };

        const isClearingSearch = toSearchText === '';
        const delay = isClearingSearch
          ? 0
          : toSearchFacets
            ? inputDelay / 3
            : inputDelay;

        if (delay === 0) {
          runSearch();
          return;
        }

        timeoutRef.current = setTimeout(runSearch, delay);
      },

      [
        deepQuery,
        facets,
        id,
        setLocationSearchData,
        searchText,
        sortOn,
        sortOrder,
        facetSettings,
      ],
    );

    const removeSearchQuery = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      let newSearchData = { ...searchData };
      newSearchData.query = searchData.query.reduce(
        (acc, kvp) => (kvp.i === 'SearchableText' ? acc : [...acc, kvp]),
        [],
      );
      setSearchData(newSearchData);
      setLocationSearchData(getSearchFields(newSearchData));
    };

    const querystringResults = useSelector(
      (state) => state.querystringsearch.subrequests,
    );
    const totalItems =
      querystringResults[id]?.total || querystringResults[id]?.items?.length;

    return (
      <WrappedComponent
        {...props}
        searchData={searchData}
        facets={facets}
        setFacets={setFacets}
        setSortOn={setSortOn}
        setSortOrder={setSortOrder}
        sortOn={sortOn}
        sortOrder={sortOrder}
        searchedText={urlSearchText}
        searchText={searchText}
        removeSearchQuery={removeSearchQuery}
        setSearchText={setSearchText}
        onTriggerSearch={onTriggerSearch}
        totalItems={totalItems}
      />
    );
  }
  WithSearch.displayName = `WithSearch(${getDisplayName(WrappedComponent)})`;

  return WithSearch;
};

export default withSearch;
