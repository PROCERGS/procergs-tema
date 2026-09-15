import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import resetSVG from '@plone/volto/icons/reset.svg';
import themeSVG from '@plone/volto/icons/theme.svg';
import { useGlobalRegions } from 'volto-global-regions';
import {
  createDefaultThemeRegion,
  THEME_BLOCK_TYPE,
} from '../../../config/globalRegionDefaults';
import ThemeBlockView from '../../blocks/globalTheme/View';
import {
  DEFAULT_SITE_THEME_COLORS,
  getContrastRatio,
  getSiteThemeColors,
} from '../../blocks/globalTheme/themeColors';
import SiteThemeColorWidget from '../../widgets/SiteThemeColorWidget';

const MENU_ID = 'procergs-site-theme-menu';
const THEME_BLOCK_ID = 'procergs-global-theme';

const colorFields = [
  {
    id: 'primaryColor',
    title: 'Cor primária',
  },
  {
    id: 'secondaryColor',
    title: 'Cor secundária',
  },
  {
    id: 'textColor',
    title: 'Cor da fonte',
  },
  {
    id: 'backgroundColor',
    title: 'Cor de fundo',
  },
  {
    id: 'linkColor',
    title: 'Links e destaques',
  },
];

const getThemeBlock = (region) => {
  const items = region?.blocks_layout?.items || [];
  const id = items.find(
    (item) => region?.blocks?.[item]?.['@type'] === THEME_BLOCK_TYPE,
  );

  return id ? { id, data: region.blocks[id] } : null;
};

const updateThemeRegion = (region, colors) => {
  const base = region || createDefaultThemeRegion();
  const storedBlock = getThemeBlock(base);
  const blockId = storedBlock?.id || THEME_BLOCK_ID;
  const items = base.blocks_layout?.items || [];

  return {
    ...base,
    blocks: {
      ...(base.blocks || {}),
      [blockId]: {
        ...(storedBlock?.data || {}),
        '@type': THEME_BLOCK_TYPE,
        ...getSiteThemeColors(colors),
      },
    },
    blocks_layout: {
      ...(base.blocks_layout || {}),
      items: items.includes(blockId) ? items : [...items, blockId],
    },
  };
};

export const SiteThemeGlobalStyle = () => {
  const globalRegions = useGlobalRegions();
  const block = getThemeBlock(globalRegions.regions?.theme);

  return block ? <ThemeBlockView data={block.data} /> : null;
};

export const SiteThemeToolbar = ({ visible = true, order = 30 }) => {
  const globalRegions = useGlobalRegions();
  const storedRegion = globalRegions.regions?.theme;
  const storedBlock = useMemo(
    () => getThemeBlock(storedRegion),
    [storedRegion],
  );
  const storedColors = useMemo(
    () => getSiteThemeColors(storedBlock?.data),
    [storedBlock],
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(storedColors);
  const [portalHost, setPortalHost] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [position, setPosition] = useState({
    top: 12,
    left: 88,
    width: 416,
  });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (open) {
      setDraft(storedColors);
      setSaveError(null);
    }
  }, [open, storedColors]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;

    const buttonRect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    const viewportMargin = 12;
    const width = Math.min(416, window.innerWidth - viewportMargin * 2);
    const menuHeight = menuRef.current?.offsetHeight || 620;
    const spaceOnRight = window.innerWidth - buttonRect.right - gap;
    const left =
      spaceOnRight >= width
        ? buttonRect.right + gap
        : Math.max(viewportMargin, buttonRect.left - width - gap);
    const top = Math.max(
      viewportMargin,
      Math.min(
        buttonRect.top,
        window.innerHeight - menuHeight - viewportMargin,
      ),
    );

    setPosition({ top, left, width });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);
    const handlePointerDown = (event) => {
      if (
        !menuRef.current?.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, updatePosition]);

  const handleSave = async () => {
    setSaveError(null);

    try {
      await globalRegions.saveRegion(
        'theme',
        updateThemeRegion(storedRegion, draft),
      );
      setOpen(false);
      triggerRef.current?.focus();
    } catch (error) {
      setSaveError('Não foi possível salvar as cores. Tente novamente.');
    }
  };

  if (!visible || !globalRegions.canEdit) return null;

  const textContrast = getContrastRatio(draft.textColor, draft.backgroundColor);
  const linkContrast = getContrastRatio(draft.linkColor, draft.backgroundColor);

  const menu = open ? (
    <aside
      id={MENU_ID}
      ref={menuRef}
      className="procergs-site-theme-menu"
      style={position}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${MENU_ID}-title`}
    >
      <ThemeBlockView data={draft} />
      <div className="procergs-site-theme-menu__header">
        <div>
          <span>APARÊNCIA</span>
          <h2 id={`${MENU_ID}-title`}>Cores do site</h2>
        </div>
        <div className="procergs-site-theme-menu__header-actions">
          <div className="procergs-site-theme-menu__palette" aria-hidden="true">
            {colorFields.map(({ id }) => (
              <span key={id} style={{ backgroundColor: draft[id] }} />
            ))}
          </div>
          <button
            type="button"
            className="procergs-site-theme-menu__close"
            aria-label="Fechar seleção de cores"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          >
            ×
          </button>
        </div>
      </div>
      <p className="procergs-site-theme-menu__help">
        Escolha as cores por função. Sucesso, atenção e erro permanecem com as
        cores padrão do Design System.
      </p>
      <Form onSubmit={handleSave}>
        {colorFields.map(({ id, title }) => (
          <SiteThemeColorWidget
            key={id}
            id={id}
            title={title}
            value={draft[id]}
            default={DEFAULT_SITE_THEME_COLORS[id]}
            onChange={(name, value) =>
              setDraft((current) => ({ ...current, [name]: value }))
            }
          />
        ))}
      </Form>
      <div className="procergs-site-theme-menu__contrast" role="status">
        <span className={textContrast >= 4.5 ? 'is-valid' : 'is-warning'}>
          Texto {textContrast.toFixed(1)}:1
        </span>
        <span className={linkContrast >= 4.5 ? 'is-valid' : 'is-warning'}>
          Links {linkContrast.toFixed(1)}:1
        </span>
      </div>
      {saveError && (
        <p className="procergs-site-theme-menu__error" role="alert">
          {saveError}
        </p>
      )}
      <div className="procergs-site-theme-menu__footer">
        <Button
          type="button"
          className="procergs-site-theme-menu__reset"
          onClick={() => {
            setDraft({ ...DEFAULT_SITE_THEME_COLORS });
            setSaveError(null);
          }}
        >
          <Icon name={resetSVG} size="18px" />
          <span>Restaurar padrões</span>
        </Button>
        <div>
          <Button type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            primary
            loading={globalRegions.saving}
            disabled={globalRegions.saving}
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </div>
    </aside>
  ) : null;

  const handleToggle = (event) => {
    triggerRef.current = event.currentTarget;
    setOpen((current) => !current);
  };

  return (
    <>
      <Plug
        pluggable="main.toolbar.top"
        id="procergs-site-theme-toolbar"
        dependencies={[open, globalRegions.saving]}
        name="procergs-site-theme-toolbar"
        order={order}
      >
        <button
          ref={triggerRef}
          type="button"
          className="global-regions-toolbar-button has-icon procergs-site-theme-toolbar-button"
          aria-label="Configurar cores do site"
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={handleToggle}
          disabled={globalRegions.saving}
        >
          <Icon name={themeSVG} size="30px" title="Configurar cores do site" />
        </button>
      </Plug>
      <Plug
        pluggable="toolbar-more-menu-list"
        id="procergs-site-theme-toolbar-more"
        dependencies={[open, globalRegions.saving]}
        name="procergs-site-theme-toolbar-more"
        order={order}
      >
        <li className="global-regions-more-item procergs-site-theme-more-item">
          <button
            type="button"
            aria-label="Configurar cores do site"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={handleToggle}
            disabled={globalRegions.saving}
          >
            Configurar cores do site
          </button>
        </li>
      </Plug>
      {portalHost && menu ? createPortal(menu, portalHost) : null}
    </>
  );
};

SiteThemeToolbar.propTypes = {
  visible: PropTypes.bool,
  order: PropTypes.number,
};
