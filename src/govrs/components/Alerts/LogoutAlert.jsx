import { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { Alerts } from '@procergs/react-govrs-ds';

const messages = defineMessages({
  loggedOutContent: {
    id: 'You have been logged out from the site.',
    defaultMessage: 'You have been logged out from the site.',
  },
});

const LogoutAlert = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const locationState =
      location.state && typeof location.state === 'object'
        ? location.state
        : {};

    if (!locationState.showLogoutAlert) return;

    setVisible(true);
    const remainingState = { ...locationState };
    delete remainingState.showLogoutAlert;
    history.replace({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: Object.keys(remainingState).length ? remainingState : undefined,
    });
  }, [history, location]);

  useEffect(() => {
    if (!visible) return undefined;

    const timeout = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="procergs-logout-alert">
      <Alerts
        dismissible
        variant="info"
        message={`${intl.formatMessage(messages.loggedOutContent)}`}
      />
    </div>
  );
};

export default LogoutAlert;
