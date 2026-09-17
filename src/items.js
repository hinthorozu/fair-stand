// catalogVisible / catalogCategory / catalogItemIndex her Item'ın kendi katalog görünüm verisidir.
// catalogPreview görünür Item'da Catalog kart renderer key'idir; type üzerinden seçilmez.
// dimensions fiziksel ürün ölçüsüdür; sceneDimensions aynı field setinin runtime override katmanıdır.
// catalogCategory yalnız UI gruplamasıdır; type, Item Contract veya registry grubundan türetilmez.
// Catalog, Item runtime repository değildir; catalogVisible=false Item'ı yok etmez.
// Kanonik Item tablosu. Satır = Item (`itemKey`). Kova map yoktur.
export const ITEMS = Object.freeze({
  upright_346_5: Object.freeze({ itemKey: 'upright_346_5', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 9, catalogPreview: 'upright', name: 'Dikme 346,5 cm', type: 'upright', unit: 'adet', dimensions: Object.freeze({ lengthCm: 346.5, thicknessCm: 8 }), sceneDimensions: Object.freeze({ widthCm: 8, depthCm: 8, heightCm: 346.5 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),
  upright_99: Object.freeze({ itemKey: 'upright_99', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Dikme 99 cm', type: 'upright', unit: 'adet', dimensions: Object.freeze({ lengthCm: 99, thicknessCm: 8 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),
  upright_49_5: Object.freeze({ itemKey: 'upright_49_5', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Dikme 49,5 cm', type: 'upright', unit: 'adet', dimensions: Object.freeze({ lengthCm: 49.5, thicknessCm: 8 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),

  profile_41_5: Object.freeze({ itemKey: 'profile_41_5', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 13, catalogPreview: 'profile', name: 'Profil 41,5 cm', type: 'profile', unit: 'adet', dimensions: Object.freeze({ lengthCm: 41.5, thicknessCm: 8 }), sceneDimensions: Object.freeze({ widthCm: 50, depthCm: 8, heightCm: 350 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),
  profile_91: Object.freeze({ itemKey: 'profile_91', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 12, catalogPreview: 'profile', name: 'Profil 91 cm', type: 'profile', unit: 'adet', dimensions: Object.freeze({ lengthCm: 91, thicknessCm: 8 }), sceneDimensions: Object.freeze({ widthCm: 100, depthCm: 8, heightCm: 350 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),
  profile_140_5: Object.freeze({ itemKey: 'profile_140_5', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 11, catalogPreview: 'profile', name: 'Profil 140,5 cm', type: 'profile', unit: 'adet', dimensions: Object.freeze({ lengthCm: 140.5, thicknessCm: 8 }), sceneDimensions: Object.freeze({ widthCm: 150, depthCm: 8, heightCm: 350 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),
  profile_190: Object.freeze({ itemKey: 'profile_190', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 10, catalogPreview: 'profile', name: 'Profil 190 cm', type: 'profile', unit: 'adet', dimensions: Object.freeze({ lengthCm: 190, thicknessCm: 8 }), sceneDimensions: Object.freeze({ widthCm: 200, depthCm: 8, heightCm: 350 }), material: 'alüminyum', defaultColor: 0xd0d3d4 }),

  panel_48_5: Object.freeze({ itemKey: 'panel_48_5', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Panel 48,5 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 48.5, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'straight', nominalModuleWidthCm: 50 }),
  panel_98: Object.freeze({ itemKey: 'panel_98', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Panel 98 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 98, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'straight', nominalModuleWidthCm: 100 }),
  panel_147_5: Object.freeze({ itemKey: 'panel_147_5', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Panel 147,5 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 147.5, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'straight', nominalModuleWidthCm: 150 }),
  panel_197: Object.freeze({ itemKey: 'panel_197', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Panel 197 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 197, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'straight', nominalModuleWidthCm: 200 }),

  panel_corner_42_5: Object.freeze({ itemKey: 'panel_corner_42_5', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'İç Köşe Paneli 42,5 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 42.5, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'inner-corner', nominalModuleWidthCm: 50 }),
  panel_corner_92: Object.freeze({ itemKey: 'panel_corner_92', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'İç Köşe Paneli 92 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 92, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'inner-corner', nominalModuleWidthCm: 100 }),
  panel_corner_142_5: Object.freeze({ itemKey: 'panel_corner_142_5', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'İç Köşe Paneli 142,5 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 142.5, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'inner-corner', nominalModuleWidthCm: 150 }),
  panel_corner_192: Object.freeze({ itemKey: 'panel_corner_192', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'İç Köşe Paneli 192 × 47 cm', type: 'panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 192, heightCm: 47, thicknessCm: 0.8 }), material: 'sunta', panelRole: 'inner-corner', nominalModuleWidthCm: 200 }),

  separator_panel_48_5: Object.freeze({ itemKey: 'separator_panel_48_5', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Separatör Paneli 48,5 × 47 cm', type: 'separator-panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 48.5, heightCm: 47, thicknessCm: 0.8 }), material: 'mdf', defaultColor: 0xc79b63, nominalModuleWidthCm: 50 }),
  separator_panel_98: Object.freeze({ itemKey: 'separator_panel_98', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Separatör Paneli 98 × 47 cm', type: 'separator-panel', unit: 'adet', dimensions: Object.freeze({ widthCm: 98, heightCm: 47, thicknessCm: 0.8 }), material: 'mdf', defaultColor: 0xc79b63, nominalModuleWidthCm: 100 }),

  connector_start: Object.freeze({ itemKey: 'connector_start', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Başlangıç Aparatı', type: 'connector', unit: 'adet', connectorType: 'start' }),
  connector_single: Object.freeze({ itemKey: 'connector_single', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Tekli Aparat', type: 'connector', unit: 'adet', connectorType: 'single' }),
  connector_double: Object.freeze({ itemKey: 'connector_double', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Çiftli Aparat', type: 'connector', unit: 'adet', connectorType: 'double' }),
  connector_corner: Object.freeze({ itemKey: 'connector_corner', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Köşe Aparatı', type: 'connector', unit: 'adet', connectorType: 'corner' }),

  door_leaf_100: Object.freeze({ itemKey: 'door_leaf_100', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Ahşap Kapı Kanadı 100 × 200 cm', type: 'door-leaf', unit: 'adet', dimensions: Object.freeze({ widthCm: 100, heightCm: 200, thicknessCm: 8 }), material: 'ahşap', defaultColor: 0xffffff, nominalModuleWidthCm: 100 }),

  shelf_100: Object.freeze({ itemKey: 'shelf_100', catalogVisible: true, catalogCategory: 'shelf-showcase', catalogItemIndex: 3, catalogPreview: 'shelf', name: 'Raf 100 cm', type: 'shelf', unit: 'adet', dimensions: Object.freeze({ lengthCm: 100, depthCm: 38, thicknessCm: 1.8 }), sceneDimensions: Object.freeze({ widthCm: 100, heightCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff, nominalModuleWidthCm: 100 }),
  shelf_150: Object.freeze({ itemKey: 'shelf_150', catalogVisible: true, catalogCategory: 'shelf-showcase', catalogItemIndex: 4, catalogPreview: 'shelf', name: 'Raf 150 cm', type: 'shelf', unit: 'adet', dimensions: Object.freeze({ lengthCm: 150, depthCm: 38, thicknessCm: 1.8 }), sceneDimensions: Object.freeze({ widthCm: 150, heightCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff, nominalModuleWidthCm: 150 }),
  shelf_200: Object.freeze({ itemKey: 'shelf_200', catalogVisible: true, catalogCategory: 'shelf-showcase', catalogItemIndex: 5, catalogPreview: 'shelf', name: 'Raf 200 cm', type: 'shelf', unit: 'adet', dimensions: Object.freeze({ lengthCm: 200, depthCm: 38, thicknessCm: 1.8 }), sceneDimensions: Object.freeze({ widthCm: 200, heightCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff, nominalModuleWidthCm: 200 }),
  shelf_leg: Object.freeze({ itemKey: 'shelf_leg', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Raf Ayağı', type: 'shelf-accessory', unit: 'adet' }),

  showcase_side_94_6_30: Object.freeze({ itemKey: 'showcase_side_94_6_30', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Vitrin Yan Sunta 94,6 × 30 cm', type: 'showcase-board', unit: 'adet', dimensions: Object.freeze({ lengthCm: 94.6, depthCm: 30, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff }),
  showcase_side_143_5_30: Object.freeze({ itemKey: 'showcase_side_143_5_30', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Vitrin Yan Sunta 143,5 × 30 cm', type: 'showcase-board', unit: 'adet', dimensions: Object.freeze({ lengthCm: 143.5, depthCm: 30, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff }),
  showcase_horizontal_87_4_30: Object.freeze({ itemKey: 'showcase_horizontal_87_4_30', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Vitrin Yatay Sunta 87,4 × 30 cm', type: 'showcase-board', unit: 'adet', dimensions: Object.freeze({ lengthCm: 87.4, depthCm: 30, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff }),
  glass_shelf: Object.freeze({ itemKey: 'glass_shelf', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Cam Raf', type: 'showcase-accessory', unit: 'adet', dimensions: Object.freeze({ lengthCm: 87.3, depthCm: 28.5, thicknessCm: 0.6 }), material: 'cam' }),

  counter_top_110_60: Object.freeze({ itemKey: 'counter_top_110_60', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Banko Üstü 110 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 110, depthCm: 60, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xf8fafc, nominalModuleWidthCm: 100 }),
  counter_top_52_60: Object.freeze({ itemKey: 'counter_top_52_60', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Banko Üstü 52 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 52, depthCm: 60, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xf8fafc, nominalModuleWidthCm: 100 }),
  counter_top_160_60: Object.freeze({ itemKey: 'counter_top_160_60', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Banko Üstü 160 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 160, depthCm: 60, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xf8fafc, nominalModuleWidthCm: 150 }),
  counter_top_102_60: Object.freeze({ itemKey: 'counter_top_102_60', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Banko Üstü 102 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 102, depthCm: 60, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xf8fafc, nominalModuleWidthCm: 150 }),
  counter_top_210_60: Object.freeze({ itemKey: 'counter_top_210_60', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Banko Üstü 210 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 210, depthCm: 60, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xf8fafc, nominalModuleWidthCm: 200 }),
  counter_top_150_60: Object.freeze({ itemKey: 'counter_top_150_60', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Banko Üstü 150 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 150, depthCm: 60, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xf8fafc, nominalModuleWidthCm: 200 }),

  base_top_107_50: Object.freeze({ itemKey: 'base_top_107_50', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Baza Üstü 107 × 50 cm', type: 'base-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 107, depthCm: 50, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff, nominalModuleWidthCm: 100 }),
  base_top_157_50: Object.freeze({ itemKey: 'base_top_157_50', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Baza Üstü 157 × 50 cm', type: 'base-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 157, depthCm: 50, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff, nominalModuleWidthCm: 150 }),
  base_top_206_50: Object.freeze({ itemKey: 'base_top_206_50', catalogVisible: false, catalogCategory: null, catalogItemIndex: null, name: 'Baza Üstü 206 × 50 cm', type: 'base-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 206, depthCm: 50, thicknessCm: 1.8 }), material: 'sunta', defaultColor: 0xffffff, nominalModuleWidthCm: 200 }),


  COAT_RACK: Object.freeze({
    itemKey: 'COAT_RACK', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 11, catalogPreview: 'coat-rack', name: 'Askılık', type: 'coat-rack', unit: 'adet',
    dimensions: Object.freeze({ widthCm: 43, depthCm: 43, heightCm: 180 }),
    modelFile: 'coat_rack.glb',
  }),
  KETTLE: Object.freeze({
    itemKey: 'KETTLE', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 10, catalogPreview: 'kettle', name: 'Kettle', type: 'kettle', unit: 'adet',
    dimensions: Object.freeze({ widthCm: 24, depthCm: 19, heightCm: 25 }),
    modelFile: 'kettle.glb',
  }),
  MINI_FRIDGE_AVANTI: Object.freeze({
    itemKey: 'MINI_FRIDGE_AVANTI', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 9, catalogPreview: 'mini-fridge', name: 'Mini Buzdolabı', type: 'mini-fridge', unit: 'adet',
    dimensions: Object.freeze({ widthCm: 50, depthCm: 50, heightCm: 66 }),
    modelFile: '80s_avanti_mini_fridge.glb',
  }),
  PLASTIC_TRASH_BIN: Object.freeze({
    itemKey: 'PLASTIC_TRASH_BIN', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 12, catalogPreview: 'plastic-trash-bin', name: 'Çöp Kutusu', type: 'plastic-trash-bin', unit: 'adet',
    dimensions: Object.freeze({ widthCm: 40, depthCm: 40, heightCm: 60 }),
    modelFile: 'plastic_trash_bin.glb', preserveModelScale: false,
    modelRotationYDeg: 0, visualRotationYDeg: -90,
  }),


  furniture_sofa_set_classic: Object.freeze({
    itemKey: 'furniture_sofa_set_classic', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 1, catalogPreview: 'sofa-set',
    name: 'Koltuk Takımı',
    type: 'sofa-set-classic',
    dimensions: Object.freeze({
      widthCm: 150,
      depthCm: 150,
      heightCm: 78,
    }),
    composition: Object.freeze({
      items: Object.freeze([
        Object.freeze({ itemKey: 'furniture_sofa_double_classic', quantity: 1 }),
        Object.freeze({ itemKey: 'furniture_sofa_single_classic', quantity: 2 }),
        Object.freeze({ itemKey: 'furniture_coffee_table_classic', quantity: 1 }),
      ]),
    }),
  }),
  furniture_sofa_single_classic: Object.freeze({
    itemKey: 'furniture_sofa_single_classic', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 2, catalogPreview: 'sofa-single',
    name: 'Tekli Koltuk',
    type: 'sofa-single-classic',
    dimensions: Object.freeze({
      widthCm: 65,
      depthCm: 45,
      heightCm: 78,
    }),
    visualRotationYDeg: -135,
  }),
  furniture_sofa_double_classic: Object.freeze({
    itemKey: 'furniture_sofa_double_classic', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 3, catalogPreview: 'sofa-double',
    name: 'Çiftli Koltuk',
    type: 'sofa-double-classic',
    dimensions: Object.freeze({
      widthCm: 150,
      depthCm: 45,
      heightCm: 78,
    }),
    visualRotationYDeg: -45,
  }),
  furniture_coffee_table_classic: Object.freeze({
    itemKey: 'furniture_coffee_table_classic', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 4, catalogPreview: 'coffee-table',
    name: 'Sehpa',
    type: 'coffee-table-classic',
    dimensions: Object.freeze({
      widthCm: 60,
      depthCm: 42,
      heightCm: 38,
    }),
  }),
  furniture_table_chair_set_eames: Object.freeze({
    itemKey: 'furniture_table_chair_set_eames', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 5, catalogPreview: 'table-chair-set',
    name: 'Eames Masa Sandalye Takımı',
    type: 'table-chair-set-eames',
    dimensions: Object.freeze({
      widthCm: 150,
      depthCm: 150,
      heightCm: 82,
    }),
    composition: Object.freeze({
      items: Object.freeze([
        Object.freeze({ itemKey: 'glass_table', quantity: 1 }),
        Object.freeze({ itemKey: 'chair_eames', quantity: 4 }),
      ]),
    }),
  }),
  chair_eames: Object.freeze({
    itemKey: 'chair_eames', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 6, catalogPreview: 'chair',
    name: 'Eames Sandalye',
    type: 'chair',
    dimensions: Object.freeze({
      widthCm: 46,
      depthCm: 58,
      heightCm: 82,
    }),
  }),
  glass_table: Object.freeze({
    itemKey: 'glass_table', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 7, catalogPreview: 'glass-table',
    name: 'Cam Masa',
    type: 'table-glass',
    dimensions: Object.freeze({
      widthCm: 75,
      depthCm: 75,
      heightCm: 74,
    }),
  }),
  furniture_bar_stool_classic: Object.freeze({
    itemKey: 'furniture_bar_stool_classic', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 8, catalogPreview: 'bar-stool',
    name: 'Bar Taburesi',
    type: 'bar-stool',
    dimensions: Object.freeze({
      widthCm: 60,
      depthCm: 55,
      heightCm: 121,
    }),
  }),


  led_floodlight: Object.freeze({
    itemKey: 'led_floodlight', catalogVisible: true, catalogCategory: 'electronics-lighting', catalogItemIndex: 6, catalogPreview: 'floodlight',
    name: 'LED Projektör',
    type: 'led-floodlight',
    dimensions: Object.freeze({
      widthCm: 50,
      depthCm: 20,
      heightCm: 35,
      mountHeightCm: 350,
    }),
  }),


  'illuminated-foam': Object.freeze({
    itemKey: 'illuminated-foam', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Işıklı Strafor / Logo',
    type: 'illuminated-foam',
    dimensions: Object.freeze({
      widthCm: 200,
      heightCm: 50,
      depthCm: 3.5,
      wallGapCm: 1.5,
    }),
  }),
  VIDEO_WALL_PANEL: Object.freeze({
    itemKey: 'VIDEO_WALL_PANEL', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Video Wall Panel',
    type: 'video-wall-panel',
    dimensions: Object.freeze({
      widthCm: 108.5,
      heightCm: 61,
    }),
  }),


  karolaj: Object.freeze({
    itemKey: 'karolaj', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Karolaj',
    type: 'floor',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 100 }),
    defaultColor: '#e9edf1',
    paintable: true,
  }),
  hali: Object.freeze({
    itemKey: 'hali', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Halı',
    type: 'floor',
    defaultColor: '#8b8f94',
    paintable: true,
  }),
  'parke-acik': Object.freeze({
    itemKey: 'parke-acik', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Beyaz Meşe',
    type: 'floor',
    dimensions: Object.freeze({ lengthCm: 140, depthCm: 16 }),
    defaultColor: '#e8dfd1',
    paintable: false,
  }),
  'parke-sari': Object.freeze({
    itemKey: 'parke-sari', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Sarı Meşe',
    type: 'floor',
    dimensions: Object.freeze({ lengthCm: 140, depthCm: 16 }),
    defaultColor: '#c4a480',
    paintable: false,
  }),
  'parke-beton': Object.freeze({
    itemKey: 'parke-beton', catalogVisible: false, catalogCategory: null, catalogItemIndex: null,
    name: 'Beton Parke',
    type: 'floor',
    dimensions: Object.freeze({ lengthCm: 112, depthCm: 28 }),
    defaultColor: '#625f58',
    paintable: false,
  }),


  EXTRA_INDOOR_PLANT_1: Object.freeze({
    itemKey: 'EXTRA_INDOOR_PLANT_1', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 13, catalogPreview: 'indoor-plant',
    name: 'Yapay Çiçek 1',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 60, depthCm: 60, heightCm: 120 }),
    // Katalogda modelFile yoktu; factory default runtime `indoor_plants.glb` kullanır.
    // Item'da modelFile tutulmaz ki catalog resolve width/depth ile tek aday kalsın.
    modelRotationYDeg: 0,
    preserveModelScale: false,
  }),
  EXTRA_LONG_PLANTER_100: Object.freeze({
    itemKey: 'EXTRA_LONG_PLANTER_100', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 14, catalogPreview: 'long-planter',
    name: 'Uzun Saksı 100',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 30, heightCm: 30 }),
    modelFile: 'saksi_bitkili_100x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
  }),
  EXTRA_LONG_PLANTER_150: Object.freeze({
    itemKey: 'EXTRA_LONG_PLANTER_150', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 15, catalogPreview: 'long-planter',
    name: 'Uzun Saksı 150',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 30, heightCm: 30 }),
    modelFile: 'saksi_bitkili_150x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
  }),
  EXTRA_LONG_PLANTER_200: Object.freeze({
    itemKey: 'EXTRA_LONG_PLANTER_200', catalogVisible: true, catalogCategory: 'extra', catalogItemIndex: 16, catalogPreview: 'long-planter',
    name: 'Uzun Saksı 200',
    type: 'indoor-plant-1',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 30, heightCm: 30 }),
    modelFile: 'saksi_bitkili_200x30x30.glb',
    modelRotationYDeg: 90,
    preserveModelScale: true,
  }),


  TV_42: Object.freeze({
    itemKey: 'TV_42', catalogVisible: true, catalogCategory: 'electronics-lighting', catalogItemIndex: 1, catalogPreview: 'tv', name: 'TV 42"', type: 'tv',
    dimensions: Object.freeze({
      widthCm: 93.0, depthCm: 5, heightCm: 52.3,
    }),
    sceneDimensions: Object.freeze({ heightCm: 52.3 }),
  }),
  TV_55: Object.freeze({
    itemKey: 'TV_55', catalogVisible: true, catalogCategory: 'electronics-lighting', catalogItemIndex: 2, catalogPreview: 'tv', name: 'TV 55"', type: 'tv',
    dimensions: Object.freeze({
      widthCm: 121.8, depthCm: 5, heightCm: 68.5,
    }),
    sceneDimensions: Object.freeze({ heightCm: 68.5 }),
  }),
  TV_65: Object.freeze({
    itemKey: 'TV_65', catalogVisible: true, catalogCategory: 'electronics-lighting', catalogItemIndex: 5, catalogPreview: 'tv', name: 'TV 65"', type: 'tv',
    dimensions: Object.freeze({
      widthCm: 143.9, depthCm: 5, heightCm: 80.9,
    }),
    sceneDimensions: Object.freeze({ heightCm: 80.9 }),
  }),
  VIDEO_WALL_2X2: Object.freeze({
    itemKey: 'VIDEO_WALL_2X2', catalogVisible: true, catalogCategory: 'electronics-lighting', catalogItemIndex: 3, catalogPreview: 'video-wall', name: 'Video Wall 2×2', type: 'tv',
    dimensions: Object.freeze({ depthCm: 5 }),
    sceneDimensions: Object.freeze({ widthCm: 217, heightCm: 122 }),
    videoWall: Object.freeze({ rows: 2, cols: 2, panelItemKey: 'VIDEO_WALL_PANEL' }),
  }),
  VIDEO_WALL_3X3: Object.freeze({
    itemKey: 'VIDEO_WALL_3X3', catalogVisible: true, catalogCategory: 'electronics-lighting', catalogItemIndex: 4, catalogPreview: 'video-wall', name: 'Video Wall 3×3', type: 'tv',
    dimensions: Object.freeze({ depthCm: 5 }),
    sceneDimensions: Object.freeze({ widthCm: 325.5, heightCm: 183 }),
    videoWall: Object.freeze({ rows: 3, cols: 3, panelItemKey: 'VIDEO_WALL_PANEL' }),
  }),


  door_100: Object.freeze({
    itemKey: 'door_100', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 9, catalogPreview: 'door',
    name: 'Depo Kapısı 100',
    type: 'door',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'door',
    }),
  }),
  // Serbest baza üst öğeleri type `base` paylaşır; BOM `moduleRecipes`
  // `base:100|150|200` üzerinden çözülür. Alt Item miktarları recipe'de kalır.
  BASE_100: Object.freeze({
    itemKey: 'BASE_100', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 9, catalogPreview: 'base',
    name: 'Baza 100',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
    }),
  }),
  BASE_150: Object.freeze({
    itemKey: 'BASE_150', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 8, catalogPreview: 'base',
    name: 'Baza 150',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
    }),
  }),
  BASE_200: Object.freeze({
    itemKey: 'BASE_200', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 7, catalogPreview: 'base',
    name: 'Baza 200',
    type: 'base',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 50, heightCm: 50 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'base',
    }),
  }),
  // Serbest banko üst öğeleri type `counter` paylaşır. Düz ve L varyantları
  // ayrı itemKey'lerdir; alt miktarlar moduleRecipes'te kalır (counter:* / counter-l:*).
  desk_banko_100: Object.freeze({
    itemKey: 'desk_banko_100', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 3, catalogPreview: 'counter',
    name: 'Banko 100',
    type: 'counter',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 50, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
    }),
  }),
  desk_banko_150: Object.freeze({
    itemKey: 'desk_banko_150', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 2, catalogPreview: 'counter',
    name: 'Banko 150',
    type: 'counter',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 50, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
    }),
  }),
  desk_banko_200: Object.freeze({
    itemKey: 'desk_banko_200', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 1, catalogPreview: 'counter',
    name: 'Banko 200',
    type: 'counter',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 50, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
    }),
  }),
  desk_banko_100_L: Object.freeze({
    itemKey: 'desk_banko_100_L', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 6, catalogPreview: 'counter',
    name: 'Köşe Banko 100×100',
    type: 'counter',
    shape: 'L',
    dimensions: Object.freeze({ widthCm: 100, depthCm: 100, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      options: Object.freeze({ shape: 'L' }),
    }),
  }),
  desk_banko_150_L: Object.freeze({
    itemKey: 'desk_banko_150_L', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 5, catalogPreview: 'counter',
    name: 'Köşe Banko 150×150',
    type: 'counter',
    shape: 'L',
    dimensions: Object.freeze({ widthCm: 150, depthCm: 150, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      options: Object.freeze({ shape: 'L' }),
    }),
  }),
  desk_banko_200_L: Object.freeze({
    itemKey: 'desk_banko_200_L', catalogVisible: true, catalogCategory: 'counter-base', catalogItemIndex: 4, catalogPreview: 'counter',
    name: 'Köşe Banko 200×200',
    type: 'counter',
    shape: 'L',
    dimensions: Object.freeze({ widthCm: 200, depthCm: 200, heightCm: 100 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'counter',
      options: Object.freeze({ shape: 'L' }),
    }),
  }),
  // Panel duvar üst öğeleri. Alt miktarlar moduleRecipes
  // straight-wall satırlarında kalır (50/100/150/200); Raw BOM UI yolu değişmez.
  wall_50: Object.freeze({
    itemKey: 'wall_50', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 4, catalogPreview: 'flat-panel',
    name: 'Panel 50',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 50 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
    }),
  }),
  wall_100: Object.freeze({
    itemKey: 'wall_100', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 3, catalogPreview: 'flat-panel',
    name: 'Panel 100',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
    }),
  }),
  wall_150: Object.freeze({
    itemKey: 'wall_150', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 2, catalogPreview: 'flat-panel',
    name: 'Panel 150',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 150 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
    }),
  }),
  wall_200: Object.freeze({
    itemKey: 'wall_200', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 1, catalogPreview: 'flat-panel',
    name: 'Panel 200',
    type: 'flat-panel',
    dimensions: Object.freeze({ widthCm: 200 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall',
    }),
  }),
  wall_200_short_up_2: Object.freeze({
    itemKey: 'wall_200_short_up_2', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 1, catalogPreview: 'flat-panel',
    name: 'Panel 200 Short Up 2',
    type: 'flat-panel',
    variant: 'short-up-2',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 2 }),
    dimensions: Object.freeze({ widthCm: 200 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-2',
    }),
  }),
  wall_150_short_up_2: Object.freeze({
    itemKey: 'wall_150_short_up_2', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 2, catalogPreview: 'flat-panel',
    name: 'Panel 150 Short Up 2',
    type: 'flat-panel',
    variant: 'short-up-2',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 2 }),
    dimensions: Object.freeze({ widthCm: 150 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-2',
    }),
  }),
  wall_100_short_up_2: Object.freeze({
    itemKey: 'wall_100_short_up_2', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 3, catalogPreview: 'flat-panel',
    name: 'Panel 100 Short Up 2',
    type: 'flat-panel',
    variant: 'short-up-2',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 2 }),
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-2',
    }),
  }),
  wall_50_short_up_2: Object.freeze({
    itemKey: 'wall_50_short_up_2', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 4, catalogPreview: 'flat-panel',
    name: 'Panel 50 Short Up 2',
    type: 'flat-panel',
    variant: 'short-up-2',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 2 }),
    dimensions: Object.freeze({ widthCm: 50 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-2',
    }),
  }),
  wall_200_short_up_1: Object.freeze({
    itemKey: 'wall_200_short_up_1', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 5, catalogPreview: 'flat-panel',
    name: 'Panel 200 Short Up 1',
    type: 'flat-panel',
    variant: 'short-up-1',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 1 }),
    dimensions: Object.freeze({ widthCm: 200 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-1',
    }),
  }),
  wall_150_short_up_1: Object.freeze({
    itemKey: 'wall_150_short_up_1', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 6, catalogPreview: 'flat-panel',
    name: 'Panel 150 Short Up 1',
    type: 'flat-panel',
    variant: 'short-up-1',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 1 }),
    dimensions: Object.freeze({ widthCm: 150 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-1',
    }),
  }),
  wall_100_short_up_1: Object.freeze({
    itemKey: 'wall_100_short_up_1', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 7, catalogPreview: 'flat-panel',
    name: 'Panel 100 Short Up 1',
    type: 'flat-panel',
    variant: 'short-up-1',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 1 }),
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-1',
    }),
  }),
  wall_50_short_up_1: Object.freeze({
    itemKey: 'wall_50_short_up_1', catalogVisible: true, catalogCategory: 'panel-addon', catalogItemIndex: 8, catalogPreview: 'flat-panel',
    name: 'Panel 50 Short Up 1',
    type: 'flat-panel',
    variant: 'short-up-1',
    stripOccupancy: Object.freeze({ align: 'top', stripCount: 1 }),
    dimensions: Object.freeze({ widthCm: 50 }),
    sceneDimensions: Object.freeze({ depthCm: 10 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'wall-short-up-1',
    }),
  }),
  // Separatör parent'lar (type separator). Child miktarları moduleRecipes
  // separator:50|100 satırlarında; sarmasık aynı genişlik recipe'sini paylaşır.
  wall_separator_50: Object.freeze({
    itemKey: 'wall_separator_50', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 6, catalogPreview: 'separator',
    name: 'Separatör 50',
    type: 'separator',
    dimensions: Object.freeze({ widthCm: 50 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
    }),
  }),
  wall_separator_100: Object.freeze({
    itemKey: 'wall_separator_100', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 5, catalogPreview: 'separator',
    name: 'Separatör 100',
    type: 'separator',
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
    }),
  }),
  wall_separator_50_sarmasik: Object.freeze({
    itemKey: 'wall_separator_50_sarmasik', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 8, catalogPreview: 'separator-vine',
    name: 'Separatör 50 Sarmaşık',
    type: 'separator',
    modelFile: 'wall_separator_50_sarmasik.glb',
    dimensions: Object.freeze({ widthCm: 50 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
    }),
  }),
  wall_separator_100_sarmasik: Object.freeze({
    itemKey: 'wall_separator_100_sarmasik', catalogVisible: true, catalogCategory: 'panel-wall', catalogItemIndex: 7, catalogPreview: 'separator-vine',
    name: 'Separatör 100 Sarmaşık',
    type: 'separator',
    modelFile: 'wall_separator_100_sarmasik.glb',
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'separator',
    }),
  }),
  wall_showcase_100_2: Object.freeze({
    itemKey: 'wall_showcase_100_2', catalogVisible: true, catalogCategory: 'shelf-showcase', catalogItemIndex: 2, catalogPreview: 'showcase',
    name: '2 Gözlü Vitrin 100',
    type: 'showcase-2',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    eyeCount: 2,
    bodyItems: Object.freeze({
      sideItemKey: 'showcase_side_94_6_30',
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'showcase-2',
    }),
  }),
  wall_showcase_100_3: Object.freeze({
    itemKey: 'wall_showcase_100_3', catalogVisible: true, catalogCategory: 'shelf-showcase', catalogItemIndex: 1, catalogPreview: 'showcase',
    name: '3 Gözlü Vitrin 100',
    type: 'showcase-3',
    unit: 'adet',
    dimensions: Object.freeze({ widthCm: 100 }),
    sceneDimensions: Object.freeze({ depthCm: 10, heightCm: 350 }),
    eyeCount: 3,
    bodyItems: Object.freeze({
      sideItemKey: 'showcase_side_143_5_30',
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    }),
    composition: Object.freeze({
      mode: 'recipe',
      moduleType: 'showcase-3',
    }),
  }),

});


const DOOR_LEAF_ITEM_KEYS_BY_MODULE_WIDTH = Object.freeze({
  100: 'door_leaf_100',
});

export function getDoorLeafItem(nominalModuleWidthCm) {
  const itemKey = DOOR_LEAF_ITEM_KEYS_BY_MODULE_WIDTH[Number(nominalModuleWidthCm)];
  return itemKey ? getItem(itemKey) : null;
}

const CONNECTOR_ITEM_KEYS_BY_TYPE = Object.freeze({
  start: 'connector_start',
  single: 'connector_single',
  double: 'connector_double',
  corner: 'connector_corner',
});

export function getConnectorItemKey(connectorType) {
  return CONNECTOR_ITEM_KEYS_BY_TYPE[connectorType] ?? null;
}

function normalizePositiveQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : null;
}

/**
 * Kanonik connector BOM çözümleyici.
 *
 * Miktar / sınıflandırma sahibi çağırandır (recipe veya kanonik ilişki
 * çözümleyici). Bu katman aparat miktarını renderer geometrisinden,
 * yakınlıktan veya geçici placement snap türünden tahmin etmez.
 */
export function resolveConnectorBom(requirements = []) {
  const quantities = new Map();

  for (const requirement of requirements) {
    const itemKey = requirement?.itemKey ?? getConnectorItemKey(requirement?.connectorType);
    const item = getItem(itemKey);
    if (!item || item.type !== 'connector') {
      throw new TypeError(`Unknown connector Item: ${itemKey ?? requirement?.connectorType ?? 'unknown'}.`);
    }

    const quantity = normalizePositiveQuantity(requirement?.quantity);
    if (quantity === null) {
      throw new TypeError(`Connector quantity is required for ${itemKey}.`);
    }

    quantities.set(itemKey, (quantities.get(itemKey) ?? 0) + quantity);
  }

  return Array.from(quantities, ([itemKey, quantity]) => {
    const item = getItem(itemKey);
    return Object.freeze({ itemKey, quantity, unit: item.unit, item });
  });
}

// Bağımsız ticari ürünler, doğrulanmış ürün varsayılanlarının sahibidir.


const COMMERCIAL_TYPES = Object.freeze(new Set([
  'coat-rack',
  'kettle',
  'mini-fridge',
  'plastic-trash-bin',
]));

export function getCommercialItemForType(type) {
  if (!COMMERCIAL_TYPES.has(type)) return null;
  return Object.values(ITEMS).find((item) => item.type === type) ?? null;
}

// Extra furniture. Tekil Item'lar kendi type'ına sahip. Eames ve klasik koltuk takımları child Item kümesidir.
// BOM decision-required — unit/moduleRecipes uydurulmaz.


const FURNITURE_TYPES = Object.freeze(new Set([
  'sofa-set-classic',
  'sofa-single-classic',
  'sofa-double-classic',
  'coffee-table-classic',
  'table-chair-set-eames',
  'chair',
  'table-glass',
  'bar-stool',
]));

export function getFurnitureItemForType(type) {
  if (!FURNITURE_TYPES.has(type)) return null;
  return Object.values(ITEMS).find((item) => item.type === type) ?? null;
}

// Üst profil LED projektör. Tekil katalog Item. BOM decision-required — unit/recipe uydurulmaz.


export function getTopLightItemForType(type) {
  if (type !== 'led-floodlight') return null;
  const item = getItem('led_floodlight');
  return item?.type === type ? item : null;
}

// Katalog dışı SVG → ışıklı strafor. itemKey type ile aynıdır; Catalog kartı yoktur.


// Zemin kaplamaları modül değildir; persist alanı stand.itemKey (eski kayıt: floorType). Katalog/recipe yok.


export function listFloorItems() {
  return Object.values(ITEMS).filter((item) => item.type === 'floor');
}

export function getFloorItem(floorType) {
  const item = ITEMS[floorType];
  return item?.type === 'floor' ? item : null;
}

export function getFloorSelectLabel(item) {
  if (!item) return '';
  const widthCm = Number(item.dimensions?.widthCm);
  const depthCm = Number(item.dimensions?.depthCm);
  if (item.paintable && Number.isFinite(widthCm) && Number.isFinite(depthCm)) {
    return `${item.name} · ${widthCm} × ${depthCm} cm`;
  }
  return item.name;
}

export function isParquetFloorItem(item) {
  return item?.type === 'floor' && Number(item.dimensions?.lengthCm) > 0;
}

export function isGridTileFloorItem(item) {
  return item?.type === 'floor'
    && Boolean(item.paintable)
    && Number(item.dimensions?.widthCm) > 0
    && Number(item.dimensions?.depthCm) > 0
    && !isParquetFloorItem(item);
}

export function isCarpetFloorItem(item) {
  return item?.type === 'floor'
    && Boolean(item.paintable)
    && !Number(item.dimensions?.widthCm);
}

export function resolveStandFloorItemKey(standOrKey) {
  const raw = typeof standOrKey === 'string'
    ? standOrKey
    : (standOrKey?.itemKey ?? standOrKey?.floorType ?? null);
  return getFloorItem(raw)?.itemKey ?? getFloorItem('karolaj').itemKey;
}

export function getFurnitureClusterQuantity(item, childItemKey) {
  const entry = item?.composition?.items?.find((row) => row.itemKey === childItemKey);
  return entry == null ? null : Number(entry.quantity);
}

// Yapay bitki / uzun saksı ailesi. Hepsi type `indoor-plant-1`; ayrım itemKey + ölçü/modelFile.
// BOM decision-required — composition/recipe uydurulmaz.


// Duvara asılan medya ürünleri tek `tv` davranış ailesini paylaşır. Sıradan TV'ler
// doğrulanmış ekran ölçüsüne göre parametriktir; widthCm/heightCm görünür ekrandır.
// Video wall panel ölçüsü VIDEO_WALL_PANEL Item'ındadır; ızgara rows/cols parent'ta kalır.


function resolveVideoWallPanelItem(item) {
  const panelItemKey = item?.videoWall?.panelItemKey ?? null;
  return panelItemKey ? getItem(panelItemKey) : null;
}

// Katalog, state oluşturucu ve seçim geri bildiriminin kullandığı duvar-medya ölçü çözümleyicisi.
// Video wall toplamları VIDEO_WALL_PANEL × ızgaradan okunur; sıradan TV canonical dimensions kullanır.
export function resolveWallMediaMetrics(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  if (!item || item.type !== 'tv') return null;
  const scene = resolveSceneDimensions(item);
  const depthCm = Number(item.dimensions?.depthCm);
  const base = {
    itemKey: item.itemKey, type: item.type, label: item.name, depthCm,
    widthCm: scene.widthCm,
    heightCm: scene.heightCm,
  };
  if (item.videoWall) {
    const panel = resolveVideoWallPanelItem(item);
    const panelWidthCm = Number(panel?.dimensions?.widthCm);
    const panelHeightCm = Number(panel?.dimensions?.heightCm);
    if (!Number.isFinite(panelWidthCm) || !Number.isFinite(panelHeightCm)) {
      throw new TypeError(`Missing VIDEO_WALL_PANEL dimensions for ${item.itemKey}.`);
    }
    return Object.freeze({
      ...base,
      widthCm: panelWidthCm * item.videoWall.cols,
      heightCm: panelHeightCm * item.videoWall.rows,
      videoWallRows: item.videoWall.rows,
      videoWallCols: item.videoWall.cols,
      panelItemKey: item.videoWall.panelItemKey,
    });
  }
  return Object.freeze({
    ...base,
    videoWallRows: 1,
    videoWallCols: 1,
  });
}





const SHOWCASE_ITEM_KEYS_BY_TYPE = Object.freeze({
  'showcase-2': 'wall_showcase_100_2',
  'showcase-3': 'wall_showcase_100_3',
});

export function getShowcaseItemKeyForType(type) {
  return SHOWCASE_ITEM_KEYS_BY_TYPE[type] ?? null;
}

export function getShowcaseBodyDefinition(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  const expectedItemKey = getShowcaseItemKeyForType(item?.type);
  if (!item || !expectedItemKey || item.itemKey !== expectedItemKey) return null;

  const sideItem = getItem(item.bodyItems?.sideItemKey);
  const horizontalItem = getItem(item.bodyItems?.horizontalItemKey);
  const glassShelfItem = getItem(item.bodyItems?.glassShelfItemKey);
  if (!sideItem?.dimensions || !horizontalItem?.dimensions || !glassShelfItem?.dimensions) {
    throw new TypeError(`Canonical showcase body Items are incomplete for ${item.itemKey}.`);
  }
  if (sideItem.material !== 'sunta' || horizontalItem.material !== 'sunta') {
    throw new TypeError(`Canonical showcase body boards must be sunta for ${item.itemKey}.`);
  }
  if (Number(sideItem.dimensions.depthCm) !== Number(horizontalItem.dimensions.depthCm)
      || Number(sideItem.dimensions.thicknessCm) !== Number(horizontalItem.dimensions.thicknessCm)) {
    throw new TypeError(`Canonical showcase body board depth/thickness mismatch for ${item.itemKey}.`);
  }
  if (!Number.isInteger(sideItem.defaultColor)
      || sideItem.defaultColor !== horizontalItem.defaultColor) {
    throw new TypeError(`Canonical showcase body default color mismatch for ${item.itemKey}.`);
  }
  return Object.freeze({
    item, sideItem, horizontalItem, glassShelfItem, defaultColor: sideItem.defaultColor,
  });
}

export function getItem(itemKey) {
  return ITEMS[itemKey] ?? null;
}

export function isShortUpFamilyDescriptor(descriptor) {
  const variant = descriptor?.variant ?? getItem(descriptor?.itemKey)?.variant;
  return variant === 'short-up-1' || variant === 'short-up-2';
}

export function listRegisteredItems() {
  return Object.freeze(Object.values(ITEMS));
}

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export const SCENE_DIMENSION_FIELDS = Object.freeze([
  'widthCm',
  'depthCm',
  'heightCm',
  'lengthCm',
  'thicknessCm',
]);

function readDimensionField(layer, field) {
  if (!layer || typeof layer !== 'object') return null;
  return optionalNumber(layer[field]);
}

// Scene/runtime ölçü: aynı field adı için sceneDimensions ?? dimensions ?? MISSING.
// length→width, thickness→depth, Recipe/Catalog/type/itemKey/STAND çapraz remap yoktur.
export function resolveSceneDimensions(item) {
  const resolved = {};
  for (const field of SCENE_DIMENSION_FIELDS) {
    resolved[field] = readDimensionField(item?.sceneDimensions, field)
      ?? readDimensionField(item?.dimensions, field)
      ?? null;
  }
  return Object.freeze(resolved);
}

export function requireSceneDimension(item, field) {
  const value = resolveSceneDimensions(item)[field];
  if (value == null) {
    throw new TypeError(`Item ${item?.itemKey ?? 'unknown'} is missing scene dimension ${field}.`);
  }
  return value;
}

// Katalogdaki düz bankolarda `shape` yoktur; runtime state `shape: 'straight'` kullanır.
function shapesMatch(want, have) {
  const normalizedWant = want === 'L' ? 'L' : (want == null ? null : 'straight');
  const normalizedHave = have === 'L' ? 'L' : (have == null ? null : 'straight');
  if (normalizedWant === null) return true;
  if (normalizedHave === null && normalizedWant === 'straight') return true;
  return normalizedWant === normalizedHave;
}

function normalizeItemDescriptor(descriptor) {
  const nested = descriptor?.moduleState && typeof descriptor.moduleState === 'object'
    ? descriptor.moduleState
    : null;
  const source = nested ?? descriptor ?? {};
  return {
    itemKey: source.itemKey ?? descriptor?.itemKey ?? null,
    type: source.type ?? source.moduleType ?? descriptor?.type ?? descriptor?.moduleType ?? null,
    widthCm: optionalNumber(source.widthCm ?? descriptor?.widthCm),
    depthCm: optionalNumber(source.depthCm ?? descriptor?.depthCm),
    shape: source.shape ?? source.counterShape ?? descriptor?.shape ?? descriptor?.counterShape ?? null,
    modelFile: source.modelFile ?? descriptor?.modelFile ?? null,
    variant: source.variant ?? descriptor?.variant ?? null,
  };
}

// Catalog projection'ı taklit etmez; Item master + resolveSceneDimensions okur.
function getItemIdentityFields(item) {
  const scene = resolveSceneDimensions(item);
  return {
    type: item.type,
    widthCm: optionalNumber(scene.widthCm),
    depthCm: optionalNumber(scene.depthCm),
    shape: item.shape ?? null,
    modelFile: item.modelFile ?? null,
    variant: item.variant ?? null,
  };
}

// Item identity çözümlemesi Catalog üyeliğine bağlı değildir.
export function resolveItemKey(descriptor) {
  const normalized = normalizeItemDescriptor(descriptor);
  if (normalized.itemKey && getItem(normalized.itemKey)) return normalized.itemKey;
  if (!normalized.type) return null;
  // shelf identity yalnız exact itemKey; type/width/shelfCount tahmini yok
  if (normalized.type === 'shelf') return null;

  const candidates = listRegisteredItems().filter((item) => item.type === normalized.type);
  if (!candidates.length) return null;

  const matches = candidates.filter((item) => {
    const fields = getItemIdentityFields(item);
    if (normalized.widthCm !== null && optionalNumber(fields.widthCm) !== null && optionalNumber(fields.widthCm) !== normalized.widthCm) return false;
    if (normalized.depthCm !== null && optionalNumber(fields.depthCm) !== null && optionalNumber(fields.depthCm) !== normalized.depthCm) return false;
    if ((normalized.shape !== null || fields.shape != null)
      && !shapesMatch(normalized.shape, fields.shape)) return false;
    if ((normalized.modelFile !== null || fields.modelFile != null) && (fields.modelFile ?? null) !== normalized.modelFile) return false;
    if ((normalized.variant != null || fields.variant != null) && (fields.variant ?? null) !== (normalized.variant ?? null)) return false;
    return true;
  });

  if (matches.length === 1) return matches[0].itemKey;
  if (candidates.length === 1) return candidates[0].itemKey;
  return null;
}
