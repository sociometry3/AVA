/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { i18n } from '../i18nResource';

import { InsightNarrativeStrategy } from './base';
import { getInsightName, getDefaultSeparator } from './helpers';

import type { HomogeneousInsightInfo } from './base';
import type { Language, HomogeneousPatternInfo, HomogeneousInsightType } from '../../types';
import type { ParagraphSpec, Structure } from '../../../ntv/types';

const variableMetaMap = {
  measures: {
    varType: 'metric_name',
  },
};

export default class CommonnessNarrativeStrategy extends InsightNarrativeStrategy<HomogeneousPatternInfo> {
  static readonly insightType: HomogeneousInsightType = 'commonness';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].commonness.main,
        variableMetaMap,
      },
    ];
  };

  generateTextSpec(insightInfo: HomogeneousInsightInfo, lang: Language) {
    const { measures, dimensions, insightType } = insightInfo;
    const spec = generateTextSpec({
      structures: CommonnessNarrativeStrategy.getStructures(lang),
      variable: {
        measures: measures.map((m) => m.fieldName).join(getDefaultSeparator(lang)),
        dimensions: dimensions.map((m) => m.fieldName).join(getDefaultSeparator(lang)),
        insightType: getInsightName(insightType, lang),
      },
    });
    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
