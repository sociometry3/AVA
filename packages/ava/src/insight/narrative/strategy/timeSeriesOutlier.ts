/* eslint-disable no-template-curly-in-string */
import { first, last, maxBy, minBy } from 'lodash';

import { i18n } from '../i18nResource';
import { generateTextSpec } from '../../../ntv';

import { InsightNarrativeStrategy } from './base';
import { getDiffDesc } from './helpers';

import type { InsightType, Language, InsightInfo, TimeSeriesOutlierInfo } from '../../types';
import type { ParagraphSpec, Structure } from '../../../ntv/types';

const variableMetaMap = {
  dateRange: {
    varType: 'time_desc',
  },
  measure: {
    varType: 'metric_name',
  },
  max: {
    varType: 'metric_value',
  },
  min: {
    varType: 'metric_value',
  },
  total: {
    varType: 'metric_value',
  },
  '.x': {
    varType: 'dim_value',
  },
  '.y': {
    varType: 'metric_value',
  },
  '.base': {
    varType: 'metric_value',
  },
  '.diff': {
    varType: 'delta_value',
  },
};

export default class TimeSeriesOutlierNarrativeStrategy extends InsightNarrativeStrategy<TimeSeriesOutlierInfo> {
  static readonly insightType: InsightType = 'time_series_outlier';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].timeSeriesOutlier.main,
        variableMetaMap,
      },
      {
        template: i18n[lang].timeSeriesOutlier.item,
        displayType: 'bullet',
        bulletOrder: true,
        useVariable: 'outliers',
        variableMetaMap,
      },
    ];
  };

  generateTextSpec(insightInfo: InsightInfo<TimeSeriesOutlierInfo>, lang: Language) {
    const { patterns, data } = insightInfo;
    const { measure, dimension } = patterns[0];

    const spec = generateTextSpec({
      structures: TimeSeriesOutlierNarrativeStrategy.getStructures(lang),
      variable: {
        dateRange: `${first(data)[dimension]}~${last(data)[dimension]}`,
        total: patterns.length,
        measure,
        max: maxBy(data, measure)[measure],
        min: minBy(data, measure)[measure],
        outliers: patterns.map((point) => {
          const base = point.baselines[point.index];
          const diff = point.y - base;
          return {
            ...point,
            base,
            diffDesc: getDiffDesc(diff, lang),
            diff,
          };
        }),
      },
    });

    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
