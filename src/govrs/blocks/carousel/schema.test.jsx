import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { renderToStaticMarkup } from 'react-dom/server';
import { createIntl, IntlProvider } from 'react-intl';
import CarouselBlockSchema from './schema';
import CarouselBlockBody from './CarouselBlockBody';
import messages from './messages';

jest.mock('@procergs/react-govrs-ds', () => ({ Carousel: () => null }));

const scriptsRequire = createRequire(
  require.resolve('@plone/scripts/package.json'),
);
const { parse } = scriptsRequire('pofile');
const catalog = parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../../locales/pt_BR/LC_MESSAGES/volto.po'),
    'utf8',
  ),
);
const translations = Object.fromEntries(
  catalog.items.map(({ msgid, msgstr }) => [msgid, msgstr[0]]),
);
const intl = createIntl({ locale: 'pt-BR', messages: translations });

it('translates all Carousel descriptors through the theme catalog', () => {
  Object.values(messages).forEach((message) => {
    expect(translations[message.id]).toBeTruthy();
    expect(intl.formatMessage(message)).toBe(translations[message.id]);
  });
  const schema = CarouselBlockSchema({ intl });
  expect(schema.title).toBe('Carrossel');
  expect(schema.fieldsets.map(({ title }) => title)).toEqual([
    'Conteúdo',
    'Comportamento',
    'Aparência',
  ]);
  expect(schema.properties.autoplay.title).toBe('Reprodução automática');
  expect(schema.properties.autoplaySpeed.title).toBe(
    'Velocidade da reprodução automática(ms)',
  );
  expect(schema.properties.enableSwipe.title).toBe(
    'Permitir navegação deslizando/arrastando',
  );
  expect(schema.properties.noArrowsMobile.title).toBe(
    'Ocultar setas em larguras de tela menores(mobile)',
  );
  expect(schema.properties.linkToContent.title).toBe(
    'Vincular itens do carrossel às páginas de conteúdo',
  );
});

it('preserves sort values, indicators and behavior defaults', () => {
  const { properties: p, required } = CarouselBlockSchema({ intl });
  expect(p.sort_on.choices.map(([value]) => value)).toEqual([
    'getObjPositionInParent',
    'effective',
    'sortable_title',
    'modified',
  ]);
  expect(p.sort_order.choices.map(([value]) => value)).toEqual([
    'ascending',
    'descending',
  ]);
  expect(p.indicators.choices).toEqual([
    ['default', 'Padrão'],
    ['inside', 'Internos'],
    ['numbers', 'Números'],
  ]);
  expect(p.sort_on.default).toBe('getObjPositionInParent');
  expect(p.sort_order.default).toBe('ascending');
  expect(p.indicators.default).toBe('default');
  expect(p.autoplaySpeed.default).toBe(3000);
  ['autoplay', 'circular', 'enableSwipe', 'noArrowsMobile'].forEach((key) =>
    expect(p[key].default).toBe(true),
  );
  expect(p.linkToContent.default).toBe(false);
  expect(required).toEqual(['href']);
});

it.each([
  [{}, true, 'Escolha uma pasta de origem para o carrossel'],
  [{ href: [{ '@id': '/origem' }] }, false, 'Carregando itens do carrossel'],
])(
  'renders the translated state for data=%j and loaded=%s',
  (data, loaded, text) => {
    const html = renderToStaticMarkup(
      <IntlProvider locale="pt-BR" messages={translations}>
        <CarouselBlockBody data={data} loaded={loaded} />
      </IntlProvider>,
    );
    expect(html).toContain(text);
  },
);
