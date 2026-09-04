import EditTitleBlock from '@plone/volto/components/manage/Blocks/Title/Edit';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import PublicationDate, { NEWS_ITEM } from './PublicationDate';
import TitleBlockSettingsSchema from './schema';

const TitleBlockEdit = (props) => {
  const isNewsItem = props.properties?.['@type'] === NEWS_ITEM;

  if (!isNewsItem) {
    return <EditTitleBlock {...props} />;
  }

  return (
    <div className="procergs-news-title-block">
      <EditTitleBlock {...props} />
      <PublicationDate properties={props.properties} data={props.data} />
      <SidebarPortal selected={props.selected}>
        <BlockDataForm
          schema={TitleBlockSettingsSchema}
          title="Data de publicação"
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          onChangeBlock={props.onChangeBlock}
          formData={props.data}
          block={props.block}
          navRoot={props.navRoot}
          contentType={props.contentType}
          errors={props.blocksErrors}
        />
      </SidebarPortal>
    </div>
  );
};

export default TitleBlockEdit;
