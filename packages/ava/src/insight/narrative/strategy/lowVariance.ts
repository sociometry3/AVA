/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { i18n } from '../i18nResource';

import { InsightNarrativeStrategy } from './base';

import type { InsightType, Language, InsightInfo, LowVarianceInfo } from '../../types';
import type { ParagraphSpec, Structure } from '../../../ntv/types';

const variableMetaMap = {
  measure: {
    varType: 'metric_name',
  },
  mean: {
    varType: 'metric_value',
  },
};

export default class LowVarianceNarrativeStrategy extends InsightNarrativeStrategy<LowVarianceInfo> {
  static readonly insightType: InsightType = 'low_variance';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].lowVariance.main,
        variableMetaMap,
      },
    ];
  };

  generateTextSpec(insightInfo: InsightInfo<LowVarianceInfo>, lang: Language) {
    const { patterns } = insightInfo;
    const { dimension, measure, mean } = patterns[0];
    const spec = generateTextSpec({
      structures: LowVarianceNarrativeStrategy.getStructures(lang),
      variable: {
        dimension,
        measure,
        mean,
      },
    });

    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
