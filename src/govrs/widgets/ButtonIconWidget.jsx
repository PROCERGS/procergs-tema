import React from 'react';
import { Message } from 'semantic-ui-react';
import ImageWidget from '@plone/volto/components/manage/Widgets/ImageWidget';

const ButtonIconWidget = (props) => (
  <div className="procergs-button-icon-widget">
    <ImageWidget {...props} />
    <Message
      warning
      size="small"
      header="Use um ícone SVG"
      content="O formato SVG permite que a cor do ícone acompanhe automaticamente a cor do texto, inclusive no hover."
    />
  </div>
);

export default ButtonIconWidget;
