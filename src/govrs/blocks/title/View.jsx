import ViewTitleBlock from '@plone/volto/components/manage/Blocks/Title/View';
import PublicationDate, { NEWS_ITEM } from './PublicationDate';

const TitleBlockView = (props) => {
  if (props.properties?.['@type'] !== NEWS_ITEM) {
    return <ViewTitleBlock {...props} />;
  }

  return (
    <div className="procergs-news-title-block">
      <ViewTitleBlock {...props} />
      <PublicationDate properties={props.properties} data={props.data} />
    </div>
  );
};

export default TitleBlockView;
