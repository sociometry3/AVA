/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { i18n } from '../i18nResource';

import { InsightNarrativeStrategy } from './base';
import { getInsightName, getDefaultSeparator } from './helpers';

import type { HomogeneousInsightInfo } from './base';
import type { Language, HomogeneousPatternInfo, HomogeneousInsightType } from '../../types';
import type { ParagraphSpec, Structure, StructureTemp } from '../../../ntv/types';

const variableMetaMap = {
  measures: {
    varType: 'metric_name',
  },
  '.dim': {
    varType: 'dim_value',
  },
};

export default class ExceptionNarrativeStrategy extends InsightNarrativeStrategy<HomogeneousPatternInfo> {
  static readonly insightType: HomogeneousInsightType = 'exception';

  protected static getStructures?: (lang: Language) => Structure[] = (lang) => {
    return [
      {
        template: i18n[lang].exception.main,
        variableMetaMap,
      },
    ];
  };

  protected static structureTemps: Record<Language, StructureTemp[]> = {
    'zh-CN': [
      {
        templateId: 'exceptionList',
        template: '${.dim}',
        useVariable: 'exceptions',
        separator: getDefaultSeparator('zh-CN'),
        variableMetaMap,
      },
    ],
    'en-US': [
      {
        templateId: 'exceptionList',
        template: '${.dim}',
        useVariable: 'exceptions',
        separator: getDefaultSeparator('en-US'),
        variableMetaMap,
      },
    ],
  };

  generateTextSpec(insightInfo: HomogeneousInsightInfo, lang: Language) {
    const { measures, dimensions, insightType, exceptions } = insightInfo;
    const spec = generateTextSpec({
      structures: ExceptionNarrativeStrategy.getStructures(lang),
      structureTemps: ExceptionNarrativeStrategy.structureTemps[lang],
      variable: {
        measures: measures.map((m) => m.fieldName).join(getDefaultSeparator(lang)),
        dimensions: dimensions.map((m) => m.fieldName).join(getDefaultSeparator(lang)),
        insightType: getInsightName(insightType, lang),
        exceptions: exceptions.map((dim) => ({ dim })),
      },
    });
    return spec.sections[0].paragraphs as ParagraphSpec[];
  }
}
