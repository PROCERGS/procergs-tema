import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import DefaultNoResultsComponent from '@plone/volto/components/manage/Blocks/Listing/DefaultNoResultsComponent';
import ListingBlockView from '../../govrs/blocks/listing/View';
import ListingBlockEdit from '../../govrs/blocks/listing/Edit';
import ListingBlockSchema from '../../govrs/blocks/listing/schema';
import getListingBlockAsyncData from '../../govrs/blocks/listing/getAsyncData';
import ListingVariationTemplate from '../../govrs/blocks/listing/ListingVariationTemplate';
import ListingQueryWidget, {
  ListingQuerystringWidget,
} from '../../govrs/blocks/listing/ListingQueryWidget';

const configureListingBlock = (config) => {
  const existing = config.blocks.blocksConfig.listing;

  config.widgets.widget = {
    ...config.widgets.widget,
    listing_query: ListingQueryWidget,
    listing_querystring: ListingQuerystringWidget,
  };

  config.blocks.blocksConfig.listing = {
    ...existing,
    view: ListingBlockView,
    edit: ListingBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: ListingBlockSchema,
    getAsyncData: getListingBlockAsyncData,
    noResultsComponent: DefaultNoResultsComponent,
    variations: [
      ...(existing.variations || []),
      {
        id: 'link',
        title: 'Link',
        template: ListingVariationTemplate,
      },
      {
        id: 'card',
        title: 'Card',
        template: ListingVariationTemplate,
      },
      {
        id: 'file',
        title: 'Arquivos',
        template: ListingVariationTemplate,
        fullobjects: true,
      },
    ],
  };

  return config;
};

export default configureListingBlock;
