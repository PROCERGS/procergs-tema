import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { BarraAcessibilidade } from '@procergs/react-govrs-ds';
import { getSecretariatIdentity } from '../../blocks/globalAccessibility/secretariat';

const isPublicPage = () =>
  typeof document !== 'undefined' &&
  document.body.classList.contains('public-ui');

const focusAfterRender = (selector) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const element = document.querySelector(selector);
      element?.focus();

      if (element instanceof HTMLInputElement) {
        element.select();
      }
    });
  });
};

const activateContentShortcut = () => {
  if (!isPublicPage()) return;

  const firstBlock = document.querySelector('#page-document > *');
  const target = firstBlock || document.getElementById('view');

  if (!(target instanceof HTMLElement)) return;

  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }

  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const activateMenuShortcut = () => {
  if (!isPublicPage()) return;

  const header = document.querySelector('.procergs-header-wrapper');
  const desktopLink = header?.querySelector(
    '.procergs-secretariat-header .procergs-header-v2__desktop-navigation a',
  );
  if (
    desktopLink instanceof HTMLElement &&
    desktopLink.getClientRects().length
  ) {
    header?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    desktopLink.focus();
    return;
  }
  const toggle = header?.querySelector('.govrs-menu-hamburger__toggle');

  header?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (!(toggle instanceof HTMLElement)) return;

  if (toggle.getAttribute('aria-expanded') !== 'true') {
    toggle.click();
  }
  focusAfterRender('.govrs-menu-hamburger__toggle');
};

const activateSearchShortcut = () => {
  if (!isPublicPage()) return;

  const field = document.querySelector('.govrs-search__field');
  if (field instanceof HTMLInputElement) {
    field.focus();
    field.select();
    return;
  }

  const toggle = document.querySelector(
    '.govrs-header__search-toggle, [aria-label="Abrir busca"]',
  );
  if (toggle instanceof HTMLElement) {
    toggle.click();
    focusAfterRender('.govrs-search__field');
  }
};

export const ProcergsGlobalAccessibilityBarBlock = ({ data, metadata }) => {
  const regionProps = metadata?.globalRegionProps || {};
  const allowOverlay = data?.allowOverlay !== false;
  const identity = getSecretariatIdentity(data);

  const accessibilityBar = (
    <BarraAcessibilidade
      shortcuts={[
        {
          title: 'Conteúdo',
          href: '#view',
          onActivate: activateContentShortcut,
        },
        {
          title: 'Menu',
          href: '#main',
          onActivate: activateMenuShortcut,
        },
        {
          title: 'Busca',
          href: '#main',
          onActivate: activateSearchShortcut,
        },
      ]}
      hrefSitemap="/sitemap"
      secretariatName={identity?.text}
      secretariatImageSrc={identity?.imageUrl}
      secretariatImageAlt={identity?.imageAlt}
    />
  );

  return (
    <div
      className={cx('procergs-accessibility-wrapper', {
        'allows-group-overlay': allowOverlay,
        'is-secretariat': Boolean(identity),
      })}
      style={
        regionProps.overlayForeground
          ? {
              '--procergs-overlay-header-foreground':
                regionProps.overlayForeground,
            }
          : undefined
      }
    >
      {accessibilityBar}
    </div>
  );
};

ProcergsGlobalAccessibilityBarBlock.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  metadata: PropTypes.shape({
    globalRegionProps: PropTypes.shape({
      overlayForeground: PropTypes.string,
    }),
  }),
};

export default ProcergsGlobalAccessibilityBarBlock;
