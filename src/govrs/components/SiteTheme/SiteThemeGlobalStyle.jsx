import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getColorPalette } from '../../../actions/colorPalette';
import ThemeBlockView from '../../blocks/globalTheme/View';

const SiteThemeGlobalStyle = () => {
  const dispatch = useDispatch();
  const palette = useSelector((state) => state.colorPalette?.data);
  const request = useSelector((state) => state.colorPalette?.get);

  useEffect(() => {
    if (!request?.loading && !request?.loaded && !request?.error) {
      dispatch(getColorPalette());
    }
  }, [dispatch, request?.error, request?.loaded, request?.loading]);

  return <ThemeBlockView data={palette} />;
};

export default SiteThemeGlobalStyle;
