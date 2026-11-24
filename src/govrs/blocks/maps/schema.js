import messages from './messages';

const markerItemSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.markers),
  addMessage: intl.formatMessage(messages.addMarker),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultGroup),
      fields: ['title', 'lat', 'lng'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.markerTitle),
    },
    lat: {
      title: intl.formatMessage(messages.latitude),
      type: 'number',
    },
    lng: {
      title: intl.formatMessage(messages.longitude),
      type: 'number',
    },
  },
  required: ['lat', 'lng'],
});

export const MapsBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.maps),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultGroup),
      fields: ['markers', 'showMarkerList', 'markerListLabel'],
    },
    {
      id: 'style',
      title: intl.formatMessage(messages.style),
      fields: ['align'],
    },
  ],
  properties: {
    markers: {
      title: intl.formatMessage(messages.markers),
      widget: 'object_list',
      schema: markerItemSchema({ intl }),
      default: [],
    },
    showMarkerList: {
      title: intl.formatMessage(messages.showMarkerList),
      type: 'boolean',
      default: false,
    },
    markerListLabel: {
      title: intl.formatMessage(messages.markerListLabel),
      default: 'Todos os lugares',
    },
    align: {
      title: intl.formatMessage(messages.alignment),
      widget: 'align',
    },
  },
  required: [],
});

export default MapsBlockSchema;
