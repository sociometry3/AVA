/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { i18n } from '../i18nResource';

import { InsightNarrativeStrategy } from './base';

import type { InsightType, Language, InsightInfo, CorrelationInfo } from '../../types';
import type { ParagraphSpec, Structure } from '../../../ntv/types';

const variableMetaMap = {
  pcorr: {
    varType: 'metric_value',
  },
  m1: {
    varType: 'metric_value',
  },
  m2: {
    varType: 'metric_value',
  },
};

export default class CorrelationNarrativeStrategy extends InsightNarrativeStrategy<CorrelationInfo> {
  static readonly insightType: InsightType = 'correlation';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].correlation.main,
        variableMetaMap,
      },
    ];
  };

  generateTextSpec(insightInfo: InsightInfo<CorrelationInfo>, lang: Language) {
    const { patterns } = insightInfo;
    const {
      measures: [m1, m2],
      pcorr,
    } = patterns[0];
    const spec = generateTextSpec({
      structures: CorrelationNarrativeStrategy.getStructures(lang),
      variable: {
        m1,
        m2,
        pcorr,
      },
    });

    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
