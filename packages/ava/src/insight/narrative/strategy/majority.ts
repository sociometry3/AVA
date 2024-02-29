/* eslint-disable no-template-curly-in-string */
import { sumBy } from 'lodash';

import { i18n } from '../i18nResource';
import { generateTextSpec } from '../../../ntv';

import { InsightNarrativeStrategy } from './base';

import type { InsightType, Language, InsightInfo, MajorityInfo } from '../../types';
import type { ParagraphSpec, Structure } from '../../../ntv/types';

const variableMetaMap = {
  measure: {
    varType: 'metric_name',
  },
  total: {
    varType: 'metric_value',
  },
  proportion: {
    varType: 'proportion',
  },
  dimValue: {
    varType: 'dim_value',
  },
  y: {
    varType: 'metric_value',
  },
};

export default class MajorityNarrativeStrategy extends InsightNarrativeStrategy<MajorityInfo> {
  static readonly insightType: InsightType = 'majority';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].majority.main,
        variableMetaMap,
      },
    ];
  };

  generateTextSpec(insightInfo: InsightInfo<MajorityInfo>, lang: Language) {
    const { patterns, data } = insightInfo;
    const { dimension, measure, x, y } = patterns[0];
    const total = sumBy(data, measure);
    const spec = generateTextSpec({
      structures: MajorityNarrativeStrategy.getStructures(lang),
      variable: {
        dimension,
        measure,
        dimValue: x,
        y,
        total,
        proportion: y / total,
      },
    });

    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
