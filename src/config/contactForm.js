import ContactForm from '@plone/volto/components/theme/ContactForm/ContactForm';
import NotFound from '@plone/volto/components/theme/NotFound/NotFound';

const configureContactForm = (config) => {
  config.addonRoutes = [
    ...(config.addonRoutes || []),
    {
      path: '/fale-conosco',
      exact: true,
      component: ContactForm,
    },
    {
      path: '/contact-form',
      exact: true,
      component: NotFound,
    },
  ];

  return config;
};

export default configureContactForm;
