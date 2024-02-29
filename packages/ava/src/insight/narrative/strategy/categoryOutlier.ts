/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { i18n } from '../i18nResource';

import { InsightNarrativeStrategy } from './base';
import { getDefaultSeparator } from './helpers';

import type { InsightType, Language, InsightInfo, CategoryOutlierInfo } from '../../types';
import type { ParagraphSpec, Structure, StructureTemp } from '../../../ntv/types';

const variableMetaMap = {
  measure: {
    varType: 'metric_name',
  },
  total: {
    varType: 'metric_value',
  },
  '.x': {
    varType: 'dim_value',
  },
};

export default class CategoryOutlierNarrativeStrategy extends InsightNarrativeStrategy<CategoryOutlierInfo> {
  static readonly insightType: InsightType = 'category_outlier';

  protected static getStructures: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].categoryOutlier.main,
        variableMetaMap,
      },
    ];
  };

  protected static getStructureTemps: (lang: Language) => StructureTemp[] = (lang) => {
    return [
      {
        templateId: 'outliers',
        template: i18n[lang].categoryOutlier.outliers,
        separator: getDefaultSeparator(lang),
        variableMetaMap,
        useVariable: 'patterns',
      },
    ];
  };

  generateTextSpec(insightInfo: InsightInfo<CategoryOutlierInfo>, lang: Language) {
    const { patterns } = insightInfo;
    const { dimension, measure } = patterns[0];
    const spec = generateTextSpec({
      structures: CategoryOutlierNarrativeStrategy.getStructures(lang),
      variable: {
        dimension,
        measure,
        total: patterns.length,
        patterns,
      },
      structureTemps: CategoryOutlierNarrativeStrategy.getStructureTemps(lang),
    });

    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
