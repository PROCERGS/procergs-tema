import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export const ProcergsGlobalStateBarBlock = ({ data, metadata }) => {
  const slotRef = useRef(null);
  const regionProps = metadata?.globalRegionProps || {};
  const allowOverlay = data?.allowOverlay !== false;

  useEffect(() => {
    const slot = slotRef.current;

    const moveStandaloneBar = () => {
      const host = document.querySelector('.barra-estado-host');

      if (!slot || !host || slot.contains(host)) {
        return;
      }

      host.style.removeProperty('display');
      slot.appendChild(host);
    };

    moveStandaloneBar();

    const observer = new MutationObserver(moveStandaloneBar);
    observer.observe(document.body, {
      childList: true,
    });

    return () => {
      observer.disconnect();

      const host = slot?.querySelector('.barra-estado-host');
      if (host) {
        host.style.setProperty('display', 'none');
        document.body.appendChild(host);
      }
    };
  }, []);

  return (
    <div
      ref={slotRef}
      className={cx('procergs-state-bar-wrapper', {
        'allows-group-overlay': allowOverlay,
      })}
      style={
        regionProps.overlayForeground
          ? {
              '--procergs-overlay-header-foreground':
                regionProps.overlayForeground,
            }
          : undefined
      }
    />
  );
};

ProcergsGlobalStateBarBlock.propTypes = {
  data: PropTypes.shape({
    allowOverlay: PropTypes.bool,
  }),
  metadata: PropTypes.shape({
    globalRegionProps: PropTypes.shape({
      overlayForeground: PropTypes.string,
    }),
  }),
};

export default ProcergsGlobalStateBarBlock;
