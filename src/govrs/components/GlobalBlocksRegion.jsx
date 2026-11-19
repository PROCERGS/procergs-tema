import React, { useMemo } from 'react';
import {
  GlobalBlocksRegion as AddonGlobalBlocksRegion,
  GlobalRegionsContext,
  useGlobalRegions,
} from 'volto-global-regions';
import { isEmptyGlobalRegion } from 'volto-global-regions/helpers';

export default function GlobalBlocksRegion({ name, ...props }) {
  const globalRegions = useGlobalRegions();
  const regionName = name || globalRegions.activeRegionName;
  const { definitions, editingRegion, regions } = globalRegions;
  const editingDefinitions = useMemo(() => {
    const region = regions[regionName];
    if (
      editingRegion !== regionName ||
      region === null ||
      region === undefined ||
      !isEmptyGlobalRegion(region)
    ) {
      return definitions;
    }

    // The addon reinitializes empty regions through createDefault on edit.
    return {
      ...definitions,
      [regionName]: {
        ...definitions[regionName],
        createDefault: () => region,
      },
    };
  }, [definitions, editingRegion, regionName, regions]);
  const value = useMemo(
    () => ({ ...globalRegions, definitions: editingDefinitions }),
    [globalRegions, editingDefinitions],
  );

  return (
    <GlobalRegionsContext.Provider value={value}>
      <AddonGlobalBlocksRegion name={name} {...props} />
    </GlobalRegionsContext.Provider>
  );
}
