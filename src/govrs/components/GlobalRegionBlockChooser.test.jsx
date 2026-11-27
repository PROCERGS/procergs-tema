import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import GlobalRegionBlockChooser from './GlobalRegionBlockChooser';

jest.mock(
  '@plone/volto/components/manage/BlockChooser/BlockChooserButton',
  () =>
    function MockBlockChooserButton() {
      return <button type="button">Add block</button>;
    },
  { virtual: true },
);
jest.mock(
  '@plone/volto/registry',
  () => ({ experimental: { addBlockButton: { enabled: false } } }),
  { virtual: true },
);

it('does not open an unrestricted chooser when all region blocks are present', () => {
  expect(
    renderToStaticMarkup(<GlobalRegionBlockChooser allowedBlocks={[]} />),
  ).toBe('');
});

it('keeps the chooser available for a missing region block', () => {
  expect(
    renderToStaticMarkup(
      <GlobalRegionBlockChooser allowedBlocks={['procergsGlobalHeader']} />,
    ),
  ).toContain('Add block');
});
