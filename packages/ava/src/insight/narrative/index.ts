import InsightNarrativeStrategyFactory from './factory';
import { setI18nResource } from './i18nResource';

import type { HomogeneousInsightInfo } from './strategy/base';
import type { InsightInfo, InsightVisualizationOptions, PatternInfo, HomogeneousPatternInfo } from '../types';

function isHomogeneousPattern(
  insightInfo: InsightInfo<PatternInfo> | HomogeneousPatternInfo
): insightInfo is HomogeneousPatternInfo {
  return 'childPatterns' in insightInfo;
}

export default function generateInsightNarrative(
  insightInfo: Omit<InsightInfo<PatternInfo>, 'visualizationSpecs'> | HomogeneousInsightInfo,
  options: InsightVisualizationOptions
) {
  const insightType = isHomogeneousPattern(insightInfo) ? insightInfo?.type : insightInfo?.patterns[0]?.type;
  if (!insightType) throw Error('insight info has no insight type');

  const { lang } = options;

  const strategy = InsightNarrativeStrategyFactory.getStrategy(insightType);
  const result = strategy.generateTextSpec(insightInfo, lang);
  return result;
}

export { setI18nResource };
