import {
  findDisciplineBySlug,
  findDisciplineTranslations,
  getDisciplineSuggestions,
  listDisciplineCategories,
  listDisciplineLevels,
  listDisciplinesByTenant,
  searchDisciplinesByTenant
} from '@data/disciplines';
import type {Discipline} from '@types/cms';

export async function getDisciplines({
  tenantId,
  locale,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
}): Promise<Discipline[]> {
  return listDisciplinesByTenant({tenantId, locale, limit});
}

export async function getDisciplineListing({
  tenantId,
  locale,
  page,
  limit,
  category,
  level,
  q
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  q?: string;
}) {
  return searchDisciplinesByTenant({tenantId, locale, page, limit, category, level, q});
}

export async function getDiscipline({
  tenantId,
  locale,
  slug
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
}) {
  return findDisciplineBySlug({tenantId, locale, slug});
}

export async function getDisciplineFilters({
  tenantId,
  locale
}: {
  tenantId: string;
  locale: 'vi' | 'en';
}) {
  const [categories, levels] = await Promise.all([
    listDisciplineCategories({tenantId, locale}),
    listDisciplineLevels({tenantId, locale})
  ]);

  return {categories, levels};
}

export async function getRelatedDisciplines({
  tenantId,
  locale,
  excludeSlug,
  limit
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  excludeSlug: string;
  limit?: number;
}) {
  return getDisciplineSuggestions({tenantId, locale, excludeSlug, limit});
}

export async function getDisciplineTranslationLinks({
  translationKey,
  disciplineId
}: {
  translationKey: string;
  disciplineId?: string;
}) {
  return findDisciplineTranslations({translationKey, disciplineId});
}

export type DisciplineListing = Awaited<ReturnType<typeof getDisciplineListing>>;
export type DisciplineFilters = Awaited<ReturnType<typeof getDisciplineFilters>>;
export type DisciplineDetail = Discipline | undefined;
