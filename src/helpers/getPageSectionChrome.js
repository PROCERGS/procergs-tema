import normalizeSection from '../govrs/blocks/section/normalizeSection';

const getBlock = (content, id) => content?.blocks?.[id];

const isSection = (block) => block?.['@type'] === 'procergsSection';

export default function getPageSectionChrome(content) {
  const items = content?.blocks_layout?.items || [];
  const first = getBlock(content, items[0]);
  const last = getBlock(content, items[items.length - 1]);
  const headerEnabled = isSection(first) && Boolean(first.overlayHeader);
  const footerEnabled = isSection(last) && Boolean(last.overlayFooter);

  return {
    headerEnabled,
    footerEnabled,
    headerForeground: headerEnabled
      ? normalizeSection(first).foregroundColor
      : undefined,
    footerForeground: footerEnabled
      ? normalizeSection(last).foregroundColor
      : undefined,
  };
}
