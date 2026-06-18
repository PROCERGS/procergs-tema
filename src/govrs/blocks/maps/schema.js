import { defineMessages } from 'react-intl';

const messages = defineMessages({
  maps: {
    id: 'Maps',
    defaultMessage: 'Maps',
  },
  markers: {
    id: 'Markers',
    defaultMessage: 'Markers',
  },
  addMarker: {
    id: 'Add marker',
    defaultMessage: 'Add marker',
  },
  markerTitle: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  latitude: {
    id: 'Latitude',
    defaultMessage: 'Latitude',
  },
  longitude: {
    id: 'Longitude',
    defaultMessage: 'Longitude',
  },
  showMarkerList: {
    id: 'Show marker list',
    defaultMessage: 'Show marker list',
  },
  markerListLabel: {
    id: 'Marker list label',
    defaultMessage: 'Marker list label',
  },
  alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
});

const markerItemSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.markers),
  addMessage: intl.formatMessage(messages.addMarker),
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
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
      title: 'Default',
      fields: ['markers', 'showMarkerList', 'markerListLabel'],
    },
    {
      id: 'style',
      title: 'Style',
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
