import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import DefaultNoResultsComponent from '@plone/volto/components/manage/Blocks/Listing/DefaultNoResultsComponent';
import ListingBlockView from '../../govrs/blocks/listing/View';
import ListingBlockEdit from '../../govrs/blocks/listing/Edit';
import ListingBlockSchema from '../../govrs/blocks/listing/schema';
import getListingBlockAsyncData from '../../govrs/blocks/listing/getAsyncData';

const configureListingBlock = (config) => {
  const existing = config.blocks.blocksConfig.listing;

  config.blocks.blocksConfig.listing = {
    ...existing,
    view: ListingBlockView,
    edit: ListingBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: ListingBlockSchema,
    getAsyncData: getListingBlockAsyncData,
    noResultsComponent: DefaultNoResultsComponent,
  };

  return config;
};

export default configureListingBlock;
