import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import config from '@plone/volto/registry';
import TeaserWithButton from './WithButton';
import TeaserBlockEdit from './Edit';
import configureTeaserBlock, {
  withButtonSchema,
} from '../../../config/blocks/teaser';

jest.mock(
  '@plone/volto/registry',
  () => ({
    settings: {},
    getComponent: () => ({
      component: ({ src, item }) =>
        require('react').createElement('img', {
          src: src || item?.['@id'],
          alt: '',
        }),
    }),
  }),
  { virtual: true },
);
jest.mock(
  '@plone/volto/components/manage/Blocks/Teaser/DefaultBody',
  () => () =>
    require('react').createElement('div', { 'data-placeholder': true }),
  { virtual: true },
);
jest.mock(
  '@plone/volto/components/manage/UniversalLink/UniversalLink',
  () =>
    ({ href, openLinkInNewTab, ...props }) =>
      require('react').createElement('a', {
        ...props,
        href,
        target: openLinkInNewTab ? '_blank' : undefined,
      }),
  { virtual: true },
);

const data = {
  href: [{ '@id': '/programa', image_field: 'image' }],
  title: 'Programa',
  description: 'Descrição do programa',
  buttonLabel: 'Conheça o programa',
};

jest.mock(
  '@plone/volto/components/manage/Blocks/Teaser/Edit',
  () => () => null,
  { virtual: true },
);

test('atualizar a origem mantém a variação e permite trocar para o padrão', () => {
  const onChangeBlock = jest.fn();
  const editor = TeaserBlockEdit({
    data: { ...data, variation: 'withButton', openLinkInNewTab: true },
    onChangeBlock,
  });
  const refreshed = { href: [{ '@id': '/novo-destino' }], title: 'Atualizado' };
  editor.props.onChangeBlock('teaser', refreshed);
  expect(onChangeBlock).toHaveBeenLastCalledWith('teaser', {
    ...refreshed,
    variation: 'withButton',
    buttonLabel: data.buttonLabel,
    openLinkInNewTab: true,
  });
  const defaultData = { ...refreshed, variation: 'default' };
  editor.props.onChangeBlock('teaser', defaultData);
  expect(onChangeBlock).toHaveBeenLastCalledWith('teaser', defaultData);
});

const findLink = (node) => {
  if (!React.isValidElement(node)) return undefined;
  if (node.props.href) return node;
  return React.Children.toArray(node.props.children)
    .map(findLink)
    .find(Boolean);
};

test('só o botão tem destino; imagem, título e descrição não são links', () => {
  const html = renderToStaticMarkup(<TeaserWithButton data={data} />);
  expect(html.match(/<a\b/g)).toHaveLength(1);
  expect(html).toMatch(
    /<div class="content"><h2>Programa<\/h2><p>Descrição do programa<\/p><a/,
  );
  expect(html).toContain('href="/programa"');
  expect(html).toContain('Conheça o programa');
  expect(html).toContain('aria-hidden="true"');
});

test('bloqueia navegação na edição e mantém opção de nova aba', () => {
  const link = findLink(
    TeaserWithButton({
      data: { ...data, openLinkInNewTab: true },
      isEditMode: true,
    }),
  );
  expect(link.props.openLinkInNewTab).toBe(true);
  const event = { preventDefault: jest.fn() };
  link.props.onClick(event);
  expect(event.preventDefault).toHaveBeenCalledTimes(1);
  expect(findLink(TeaserWithButton({ data })).props.onClick).toBeUndefined();
});

test('preserva imagem personalizada, descrição oculta e padrão do texto', () => {
  const html = renderToStaticMarkup(
    <TeaserWithButton
      data={{
        ...data,
        buttonLabel: ' ',
        hide_description: true,
        preview_image: [{ '@id': '/outra-imagem' }],
      }}
    />,
  );
  expect(html).toContain('src="/outra-imagem"');
  expect(html).not.toContain('Descrição do programa');
  expect(html).toContain('Saiba mais');
  expect(
    renderToStaticMarkup(<TeaserWithButton data={{}} isEditMode />),
  ).toContain('data-placeholder');
});

test('usa a preferência de nova aba para destinos externos', () => {
  config.settings.openExternalLinkInNewTab = true;
  expect(
    findLink(
      TeaserWithButton({
        data: { ...data, href: [{ '@id': 'https://example.org/programa' }] },
      }),
    ).props.openLinkInNewTab,
  ).toBe(true);
  expect(findLink(TeaserWithButton({ data })).props.openLinkInNewTab).toBe(
    false,
  );
  delete config.settings.openExternalLinkInNewTab;
});

test('registra variação no Destaque principal e no Grid sem substituir o padrão', () => {
  const original = { id: 'default', isDefault: true, template: () => null };
  const gridEnhancer = () => null;
  const current = {
    blocks: {
      blocksConfig: {
        teaser: { variations: [original] },
        gridBlock: {
          blocksConfig: {
            teaser: { variations: [original], schemaEnhancer: gridEnhancer },
          },
        },
      },
    },
  };
  configureTeaserBlock(current);
  configureTeaserBlock(current);
  const blocks = current.blocks.blocksConfig;
  expect(blocks.teaser.variations).toHaveLength(2);
  expect(blocks.teaser.variations[0]).toBe(original);
  expect(blocks.gridBlock.blocksConfig.teaser.variations).toBe(
    blocks.teaser.variations,
  );
  expect(blocks.gridBlock.blocksConfig.teaser.schemaEnhancer).toBe(
    gridEnhancer,
  );
  const schema = {
    fieldsets: [{ id: 'default', fields: ['href'] }],
    properties: { openLinkInNewTab: { type: 'boolean' } },
  };
  const enhanced = withButtonSchema({ schema });
  expect(enhanced.fieldsets.at(-1).fields).toEqual([
    'buttonLabel',
    'openLinkInNewTab',
  ]);
  expect(enhanced.properties.openLinkInNewTab).toBe(
    schema.properties.openLinkInNewTab,
  );
  expect(schema.fieldsets).toHaveLength(1);
});
