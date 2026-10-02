/**
 * Shadows volto-authomatic's Logout component.
 *
 * Authomatic's /logout route takes precedence over Volto's default route.
 * Clear the Volto session and return to the page the user came from.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import Toast from '@plone/volto/components/manage/Toast/Toast';
import { logout } from '@plone/volto/actions/userSession/userSession';
import { purgeMessages } from '@plone/volto/actions/messages/messages';
import { toast } from 'react-toastify';

const messages = defineMessages({
  loggedOut: {
    id: 'Logged out',
    defaultMessage: 'Logged out',
  },
  loggedOutContent: {
    id: 'You have been logged out from the site.',
    defaultMessage: 'You have been logged out from the site.',
  },
});

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const intl = useIntl();
  const requestedReturnUrl = new URLSearchParams(location.search).get(
    'return_url',
  );
  const routeFallback = location.pathname.replace(/\/logout\/?$/, '') || '/';
  const returnUrl =
    requestedReturnUrl?.startsWith('/') && !requestedReturnUrl.startsWith('//')
      ? requestedReturnUrl
      : routeFallback;

  useEffect(() => {
    dispatch(logout());
    dispatch(purgeMessages());
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      history.replace(returnUrl);
      if (!toast.isActive('loggedOut')) {
        toast.info(
          <Toast
            info
            title={intl.formatMessage(messages.loggedOut)}
            content={intl.formatMessage(messages.loggedOutContent)}
          />,
          { autoClose: false, toastId: 'loggedOut' },
        );
      }
    }
  }, [history, intl, returnUrl, token]);

  return '';
};

export default Logout;
