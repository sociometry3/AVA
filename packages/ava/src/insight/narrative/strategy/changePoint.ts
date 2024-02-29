/* eslint-disable no-template-curly-in-string */
import { first, last } from 'lodash';

import { i18n } from '../i18nResource';
import { generateTextSpec } from '../../../ntv';

import { InsightNarrativeStrategy } from './base';

import type { InsightType, Language, InsightInfo, ChangePointInfo } from '../../types';
import type { ParagraphSpec, Structure } from '../../../ntv/types';

const variableMetaMap = {
  dateRange: {
    varType: 'time_desc',
  },
  total: {
    varType: 'metric_value',
  },
  measure: {
    varType: 'metric_name',
  },
};

export default class ChangePointNarrativeStrategy extends InsightNarrativeStrategy<ChangePointInfo> {
  static readonly insightType: InsightType = 'change_point';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].changePoint.main,
        variableMetaMap,
      },
    ];
  };

  generateTextSpec(insightInfo: InsightInfo<ChangePointInfo>, lang: Language) {
    const { patterns, data } = insightInfo;
    const { dimension } = patterns[0];
    const spec = generateTextSpec({
      structures: ChangePointNarrativeStrategy.getStructures(lang),
      variable: {
        dateRange: `${first(data)[dimension]}~${last(data)[dimension]}`,
        measure: patterns[0].measure,
        total: patterns.length,
      },
    });

    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
