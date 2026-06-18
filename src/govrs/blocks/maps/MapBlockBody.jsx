import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Map } from '@procergs/react-govrs-ds';
import {
  DEFAULT_MAP_ZOOM,
  getMapCenter,
  normalizeMarkers,
} from './normalizeMarkers';

const getGoogleMapsApiKey = () =>
  (typeof window !== 'undefined' && window.env?.RAZZLE_GOOGLE_MAPS_API_KEY) ||
  process.env.RAZZLE_GOOGLE_MAPS_API_KEY ||
  '';

const MapBlockBody = ({ data }) => {
  const markers = normalizeMarkers(data.markers);
  const apiKey = getGoogleMapsApiKey();

  if (!markers.length) {
    return (
      <div className="govrs-map-block__empty">
        <FormattedMessage
          id="No map markers configured"
          defaultMessage="No map markers configured"
        />
      </div>
    );
  }

  return (
    <Map
      apiKey={apiKey}
      markers={markers}
      center={getMapCenter(markers)}
      zoom={DEFAULT_MAP_ZOOM}
      editable={false}
      showMarkerList={Boolean(data.showMarkerList)}
      markerListLabel={data.markerListLabel || 'Todos os lugares'}
    />
  );
};

MapBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MapBlockBody;
