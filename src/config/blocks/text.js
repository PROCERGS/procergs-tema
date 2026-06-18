import cx from 'classnames';
import { TEXT_PARAGRAPH_DESKTOP } from '../../govrs/constants/typography';

const withParagraphTypography = (render) => (props) => {
  const attributes = {
    ...props.attributes,
    className: cx(props.attributes?.className, TEXT_PARAGRAPH_DESKTOP),
  };

  return render({ ...props, attributes });
};

const configureTextBlock = (config) => {
  const { slate } = config.settings;
  const originalParagraph = slate.elements.p;
  const originalDefault = slate.elements.default;

  slate.elements.p = withParagraphTypography(originalParagraph);
  slate.elements.default = withParagraphTypography(originalDefault);

  return config;
};

export default configureTextBlock;
