/**
 * Shadows volto-authomatic's Logout component.
 *
 * Authomatic's /logout route takes precedence over Volto's default route.
 * Clear the Volto session and return to the page the user came from.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { logout } from '@plone/volto/actions/userSession/userSession';
import { purgeMessages } from '@plone/volto/actions/messages/messages';

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const token = useSelector((state) => state.userSession.token);
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
      history.replace(returnUrl, { showLogoutAlert: true });
    }
  }, [history, returnUrl, token]);

  return null;
};

export default Logout;
