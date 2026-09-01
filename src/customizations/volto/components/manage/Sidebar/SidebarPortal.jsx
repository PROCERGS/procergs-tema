import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * Like Volto's SidebarPortal, but never calls createPortal with a missing node.
 * Header/Footer region editors run on public pages, where #sidebar-properties
 * does not exist until the region sidebar mounts.
 */
const SidebarPortal = ({ children, selected, tab = 'sidebar-properties' }) => {
  const [target, setTarget] = React.useState(null);

  React.useLayoutEffect(() => {
    if (!selected) {
      setTarget(null);
      return undefined;
    }

    const findTarget = () => document.getElementById(tab);
    const found = findTarget();
    if (found) {
      setTarget(found);
      return undefined;
    }

    const observer = new MutationObserver(() => {
      const next = findTarget();
      if (next) {
        setTarget(next);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [selected, tab]);

  if (!selected || !target) {
    return null;
  }

  return createPortal(
    <div role="form" style={{ height: '100%' }}>
      <div
        style={{ height: '100%' }}
        role="presentation"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    target,
  );
};

SidebarPortal.propTypes = {
  children: PropTypes.any,
  selected: PropTypes.bool.isRequired,
};

export default SidebarPortal;
