import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import backSVG from '@plone/volto/icons/back.svg';
import resetSVG from '@plone/volto/icons/reset.svg';
import { Button, Container, Form, Message, Segment } from 'semantic-ui-react';
import {
  getColorPalette,
  updateColorPalette,
} from '../../../actions/colorPalette';
import ThemeBlockView from '../../blocks/globalTheme/View';
import {
  DEFAULT_SITE_THEME_COLORS,
  getContrastRatio,
  getSiteThemeColors,
} from '../../blocks/globalTheme/themeColors';
import SiteThemeColorWidget from '../../widgets/SiteThemeColorWidget';

export const COLOR_FIELDS = [
  {
    id: 'primaryColor',
    title: 'Cor primária',
    description: 'Identidade principal, botões e elementos de maior destaque.',
  },
  {
    id: 'secondaryColor',
    title: 'Cor secundária',
    description: 'Superfícies auxiliares, bordas e elementos complementares.',
  },
  {
    id: 'textColor',
    title: 'Cor do texto',
    description: 'Textos e conteúdos principais sobre a cor de fundo.',
  },
  {
    id: 'backgroundColor',
    title: 'Cor de fundo',
    description: 'Superfície base das páginas do site.',
  },
  {
    id: 'linkColor',
    title: 'Links e destaques',
    description: 'Links, foco e ações textuais interativas.',
  },
];

const ColorPaletteControlPanel = () => {
  const dispatch = useDispatch();
  const storedPalette = useSelector((state) => state.colorPalette?.data);
  const getRequest = useSelector((state) => state.colorPalette?.get || {});
  const updateRequest = useSelector(
    (state) => state.colorPalette?.update || {},
  );
  const [draft, setDraft] = useState(() => getSiteThemeColors(storedPalette));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!getRequest.loading && !getRequest.loaded && !getRequest.error) {
      dispatch(getColorPalette());
    }
  }, [dispatch, getRequest.error, getRequest.loaded, getRequest.loading]);

  useEffect(() => {
    setDraft(getSiteThemeColors(storedPalette));
  }, [storedPalette]);

  const textContrast = getContrastRatio(draft.textColor, draft.backgroundColor);
  const linkContrast = getContrastRatio(draft.linkColor, draft.backgroundColor);

  const handleSave = () => {
    setSubmitted(true);
    dispatch(updateColorPalette(draft));
  };

  return (
    <div className="view-wrapper procergs-color-palette-control-panel">
      <Helmet title="Paleta de cores" />
      <ThemeBlockView data={draft} />
      <Container className="controlpanel">
        <Segment.Group raised>
          <Segment className="primary procergs-color-palette-control-panel__title">
            <Link
              to="/controlpanel"
              aria-label="Voltar para Configuração do Site"
            >
              <Icon name={backSVG} size="30px" />
            </Link>
            <span>Paleta de cores</span>
          </Segment>
          <Segment>
            <p className="procergs-color-palette-control-panel__help">
              Defina as cores do site por função semântica. As cores de sucesso,
              atenção e erro continuam seguindo o Design System GovRS.
            </p>
            {getRequest.error ? (
              <Message negative>
                Não foi possível carregar a paleta. Os valores padrão estão
                sendo exibidos.
              </Message>
            ) : null}
            {submitted && updateRequest.loaded ? (
              <Message positive>A paleta de cores foi salva.</Message>
            ) : null}
            {updateRequest.error ? (
              <Message negative>
                Não foi possível salvar a paleta de cores. Verifique suas
                permissões e tente novamente.
              </Message>
            ) : null}
            <Form onSubmit={handleSave}>
              <div className="procergs-color-palette-control-panel__preview">
                <div>
                  <strong>Pré-visualização</strong>
                  <span>As alterações abaixo ainda não foram salvas.</span>
                </div>
                <div className="procergs-color-palette-control-panel__swatches">
                  {COLOR_FIELDS.map(({ id, title }) => (
                    <span
                      key={id}
                      title={`${title}: ${draft[id]}`}
                      style={{ backgroundColor: draft[id] }}
                    />
                  ))}
                </div>
              </div>
              <div className="procergs-color-palette-control-panel__fields">
                {COLOR_FIELDS.map(({ id, title, description }) => (
                  <SiteThemeColorWidget
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    value={draft[id]}
                    default={DEFAULT_SITE_THEME_COLORS[id]}
                    onChange={(name, value) => {
                      setSubmitted(false);
                      setDraft((current) => ({
                        ...current,
                        [name]: value,
                      }));
                    }}
                  />
                ))}
              </div>
              <div
                className="procergs-color-palette-control-panel__contrast"
                role="status"
              >
                <span
                  className={textContrast >= 4.5 ? 'is-valid' : 'is-warning'}
                >
                  Contraste do texto: {textContrast.toFixed(1)}:1
                </span>
                <span
                  className={linkContrast >= 4.5 ? 'is-valid' : 'is-warning'}
                >
                  Contraste dos links: {linkContrast.toFixed(1)}:1
                </span>
              </div>
              <div className="procergs-color-palette-control-panel__actions">
                <Button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setDraft({ ...DEFAULT_SITE_THEME_COLORS });
                  }}
                >
                  <Icon name={resetSVG} size="18px" />
                  Restaurar padrões
                </Button>
                <div>
                  <Button as={Link} to="/controlpanel" type="button">
                    Cancelar
                  </Button>
                  <Button
                    primary
                    type="submit"
                    loading={updateRequest.loading}
                    disabled={updateRequest.loading}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </Form>
          </Segment>
        </Segment.Group>
      </Container>
    </div>
  );
};

export default ColorPaletteControlPanel;
