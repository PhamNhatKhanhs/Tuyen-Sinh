import type { ThemeConfig } from 'antd';

const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#D8242C', 
    colorLink: '#0D47A1',    
    colorLinkHover: '#B81D24',
    colorSuccess: '#28A745',
    colorWarning: '#FFC107',
    colorError: '#DC3545',
    colorInfo: '#17A2B8',

    fontFamily: '"Poppins", "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14,
    
    borderRadius: 6,
    borderRadiusLG: 8,

    colorTextBase: '#212529', 
    colorTextSecondary: '#495057', 
    
    colorBorder: '#DEE2E6', 
    controlHeight: 40,
    controlHeightLG: 48,
  },
  components: {
    Button: {
      colorPrimary: '#D8242C',
      colorPrimaryHover: '#B81D24',
      colorPrimaryActive: '#A01A20',
      fontWeight: 500,
      borderRadius: 6,
      borderRadiusLG: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      paddingInline: 20,
      paddingInlineLG: 24,
    },
    Layout: {
      headerBg: '#FFFFFF',
      headerHeight: 72,
    },
    Menu: {
      itemColor: '#212529', 
      itemHoverColor: '#D8242C', 
      itemSelectedColor: '#D8242C',
      itemActiveBg: '#FDECEA',
      itemSelectedBg: '#FDECEA',
      horizontalItemSelectedColor: '#D8242C',
      horizontalItemBorderRadius: 0,
      horizontalLineHeight: '70px',
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 24,
      borderRadiusLG: 10,
    },
  },
};
export default antdTheme;