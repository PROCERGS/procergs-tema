import React from 'react';
import { useIntl } from 'react-intl';
import messages from '../blocks/button/messages';
import { Message } from 'semantic-ui-react';
import ImageWidget from '@plone/volto/components/manage/Widgets/ImageWidget';

const ButtonIconWidget = (props) => {
  const intl = useIntl();
  return (
    <div className="procergs-button-icon-widget">
      <ImageWidget {...props} />
      <Message
        warning
        size="small"
        header={intl.formatMessage(messages.iconHintTitle)}
        content={intl.formatMessage(messages.iconHint)}
      />
    </div>
  );
};

export default ButtonIconWidget;
