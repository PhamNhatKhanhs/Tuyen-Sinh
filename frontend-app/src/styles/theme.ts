import type { ThemeConfig } from 'antd';

const antdTheme: ThemeConfig = {
  token: {
    // === Color System ===
    colorPrimary: '#4F60F4',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    
    // Extended color palette
    colorLink: '#4F60F4',
    colorLinkHover: '#6366F1',
    colorLinkActive: '#3730A3',
    
    // Gradient colors - stored as CSS variables for use in styles
    // These are custom properties and not part of the Ant Design token system
    // They will be accessed via CSS variables in the application
    
    // Background colors
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F8FAFC',
    colorBgSpotlight: '#FAFBFF',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    
    // Text colors
    colorText: '#1F2937',
    colorTextSecondary: '#6B7280',
    colorTextTertiary: '#9CA3AF',
    colorTextQuaternary: '#D1D5DB',
    
    // Border colors
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',
    
    // === Typography ===
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Font weights
    fontWeightStrong: 600,
    
    // Line heights
    lineHeight: 1.5714285714285714,
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.4,
    lineHeightHeading4: 1.5714285714285714,
    lineHeightHeading5: 1.5714285714285714,
    
    // === Spacing & Layout ===
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    
    // Control heights
    controlHeight: 36,
    controlHeightLG: 44,
    controlHeightSM: 28,
    controlHeightXS: 24,
    
    // Padding
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    // Margin
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // === Shadows & Effects ===
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    boxShadowCard: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
    boxShadowCardHover: '0 20px 35px -10px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)',
    boxShadowGlow: '0 0 20px rgba(79, 96, 244, 0.3)',
    boxShadowGlowSuccess: '0 0 20px rgba(16, 185, 129, 0.3)',
    boxShadowGlowWarning: '0 0 20px rgba(245, 158, 11, 0.3)',
    boxShadowGlowError: '0 0 20px rgba(239, 68, 68, 0.3)',
    boxShadowGlowInfo: '0 0 20px rgba(59, 130, 246, 0.3)',
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionDurationSlower: '0.5s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
    motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    motionEaseInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    motionBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Wireframe
    wireframe: false,
  },
  
  components: {
    // === Button Component ===
    Button: {
      colorPrimary: '#4F60F4',
      colorPrimaryHover: '#6366F1',
      colorPrimaryActive: '#3730A3',
      fontWeight: 600,
      paddingInline: 20,
      paddingInlineLG: 28,
      paddingInlineSM: 16,
      borderRadius: 10,
      borderRadiusLG: 12,
      borderRadiusSM: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.08)',
      primaryShadow: '0 6px 15px 0 rgba(79, 96, 244, 0.25)',
    },
    
    // === Layout Components ===
    Layout: {
      headerBg: 'rgba(255, 255, 255, 0.95)',
      headerHeight: 70,
      headerPadding: '0 24px',
      siderBg: '#FAFBFF',
      triggerBg: '#F1F5F9',
      triggerColor: '#64748B',
      zeroTriggerWidth: 48,
      zeroTriggerHeight: 42,
    },
    
    // === Navigation ===
    Menu: {
      itemBg: 'transparent',
      itemColor: '#64748B',
      itemHoverBg: '#EFF1FE',
      itemHoverColor: '#4F60F4',
      itemSelectedBg: '#DADEFD',
      itemSelectedColor: '#3730A3',
      itemActiveBg: '#DADEFD',
      groupTitleColor: '#9CA3AF',
      iconSize: 16,
      fontSize: 14,
      fontWeight: 500,
      itemHeight: 40,
      itemMarginInline: 4,
      itemPaddingInline: 16,
      subMenuItemBg: 'transparent',
      popupBg: '#FFFFFF',
    },
    
    Breadcrumb: {
      fontSize: 14,
      iconFontSize: 14,
      linkColor: '#6B7280',
      linkHoverColor: '#4F60F4',
      lastItemColor: '#1F2937',
      separatorColor: '#D1D5DB',
      separatorMargin: 8,
    },
    
    // === Data Entry ===
    Input: {
      borderRadius: 8,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
      colorBorder: '#D1D5DB',
      colorBorderHover: '#9CA3AF',
      activeBorderColor: '#4F60F4',
      activeShadow: '0 0 0 2px rgba(79, 96, 244, 0.1)',
      errorActiveShadow: '0 0 0 2px rgba(239, 68, 68, 0.1)',
      warningActiveShadow: '0 0 0 2px rgba(245, 158, 11, 0.1)',
    },
    
    Select: {
      borderRadius: 8,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      optionSelectedBg: '#EFF1FE',
      optionSelectedColor: '#3730A3',
      optionActiveBg: '#F8FAFC',
      selectorBg: '#FFFFFF',
      clearBg: '#FFFFFF',
      multipleItemBg: '#F1F5F9',
      multipleItemBorderColor: '#E2E8F0',
      optionHeight: 32,
      optionPadding: '5px 12px',
    },
    
    DatePicker: {
      borderRadius: 8,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      cellActiveWithRangeBg: '#EFF1FE',
      cellHoverWithRangeBg: '#F8FAFC',
      cellRangeBorderColor: '#4F60F4',
      cellBgDisabled: '#F9FAFB',
      timeColumnWidth: 56,
      timeCellHeight: 28,
    },
    
    Form: {
      labelColor: '#374151',
      labelFontSize: 14,
      labelHeight: 32,
      labelRequiredMarkColor: '#EF4444',
      itemMarginBottom: 24,
      verticalLabelPadding: '0 0 8px',
    },
    
    // === Data Display ===
    Table: {
      headerBg: '#F8FAFC',
      headerColor: '#374151',
      headerSortActiveBg: '#E2E8F0',
      headerSortHoverBg: '#F1F5F9',
      bodySortBg: '#FAFBFF',
      rowHoverBg: '#F8FAFC',
      rowSelectedBg: '#EFF1FE',
      rowSelectedHoverBg: '#DADEFD',
      rowExpandedBg: '#FAFBFF',
      borderColor: '#E5E7EB',
      headerSplitColor: '#E5E7EB',
      fixedHeaderSortActiveBg: '#F1F5F9',
      headerFilterHoverBg: '#F1F5F9',
      filterDropdownBg: '#FFFFFF',
      expandIconBg: '#FFFFFF',
      selectionColumnWidth: 32,
      stickyScrollBarBg: 'rgba(0, 0, 0, 0.35)',
    },
    
    Card: {
      colorBgContainer: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
      borderRadius: 16,
      borderRadiusLG: 20,
      borderRadiusSM: 12,
      paddingLG: 28,
      paddingMD: 24,
      paddingSM: 20,
      paddingXS: 16,
      colorBorderSecondary: 'rgba(243, 244, 246, 0.6)',
      actionsBg: 'rgba(249, 250, 251, 0.8)',
      headerBg: 'transparent',
      headerFontSize: 16,
      headerFontSizeSM: 14,
      headerHeight: 56,
      headerHeightSM: 36,
      bodyPadding: 24,
    },
    
    Descriptions: {
      titleColor: '#374151',
      titleMarginBottom: 20,
      itemPaddingBottom: 16,
      colonMarginLeft: 2,
      colonMarginRight: 8,
      labelBg: '#F9FAFB',
      contentColor: '#1F2937',
    },
    
    // === Feedback ===
    Modal: {
      headerBg: '#FFFFFF',
      contentBg: '#FFFFFF',
      titleFontSize: 18,
      titleLineHeight: 1.4,
      titleColor: '#1F2937',
      borderRadiusLG: 12,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maskBg: 'rgba(0, 0, 0, 0.45)',
      footerBg: 'transparent',
      footerBorderColorSplit: '#F3F4F6',
    },
    
    Drawer: {
      colorBgElevated: '#FFFFFF',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorIcon: '#9CA3AF',
      colorIconHover: '#6B7280',
      sizeLG: 736,
      size: 378,
      sizeSM: 378,
      footerPaddingBlock: 12,
      footerPaddingInline: 24,
    },
    
    Message: {
      contentBg: '#FFFFFF',
      contentPadding: '10px 16px',
      borderRadiusLG: 8,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    
    Notification: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadiusLG: 8,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    
    Alert: {
      borderRadiusLG: 8,
      withDescriptionIconSize: 24,
      withDescriptionPadding: '15px 15px 15px 64px',
      withDescriptionPaddingVertical: 15,
      defaultPadding: '8px 15px 8px 37px',
      closeBtnSize: 20,
    },
    
    // === Other Components ===
    Tabs: {
      titleFontSize: 14,
      titleFontSizeLG: 16,
      titleFontSizeSM: 12,
      inkBarColor: '#4F60F4',
      itemColor: '#6B7280',
      itemHoverColor: '#4F60F4',
      itemSelectedColor: '#4F60F4',
      itemActiveColor: '#3730A3',
      cardBg: '#FAFBFF',
      cardHeight: 40,
      cardPadding: '8px 16px',
      cardPaddingLG: '12px 16px',
      cardPaddingSM: '6px 12px',
      horizontalMargin: '0 0 0 32px',
      horizontalItemGutter: 32,
      horizontalItemMargin: '0 0 0 0',
      horizontalItemMarginRTL: '0 0 0 0',
      horizontalItemPadding: '12px 0',
      horizontalItemPaddingLG: '16px 0',
      horizontalItemPaddingSM: '8px 0',
    },
    
    Progress: {
      remainingColor: '#F3F4F6',
      defaultColor: '#4F60F4',
      gradientFromColor: '#4F60F4',
      gradientToColor: '#6366F1',
      lineBorderRadius: 100,
      circleTextFontSize: '1em',
      circleIconFontSize: '24px',
    },
    
    Badge: {
      textFontSize: 12,
      textFontSizeSM: 12,
      textFontWeight: 400,
      statusSize: 6,
      dotSize: 6,
      fontHeight: 20,
      fontHeightSM: 14,
      indicatorHeight: 20,
      indicatorHeightSM: 16,
    },
  },
  
  // Algorithm configuration for design token generation
  algorithm: [],
};

export default antdTheme;