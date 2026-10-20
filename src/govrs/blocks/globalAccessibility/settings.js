import config from '@plone/volto/registry';
import { ACCESSIBILITY_BAR_BLOCK_TYPE } from '../../../config/globalRegionDefaults';

export const isSecretariatEnabled = () =>
  config.blocks?.blocksConfig?.[ACCESSIBILITY_BAR_BLOCK_TYPE]
    ?.allowSecretariat !== false;
