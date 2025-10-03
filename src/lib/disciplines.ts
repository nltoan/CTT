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
  limit,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  limit?: number;
  preview?: boolean;
}): Promise<Discipline[]> {
  return listDisciplinesByTenant({tenantId, locale, limit, includeDrafts: preview});
}

export async function getDisciplineListing({
  tenantId,
  locale,
  page,
  limit,
  category,
  level,
  q,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  q?: string;
  preview?: boolean;
}) {
  return searchDisciplinesByTenant({
    tenantId,
    locale,
    page,
    limit,
    category,
    level,
    q,
    includeDrafts: preview
  });
}

export async function getDiscipline({
  tenantId,
  locale,
  slug,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  slug: string;
  preview?: boolean;
}) {
  return findDisciplineBySlug({tenantId, locale, slug, includeDrafts: preview});
}

export async function getDisciplineFilters({
  tenantId,
  locale,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  preview?: boolean;
}) {
  const [categories, levels] = await Promise.all([
    listDisciplineCategories({tenantId, locale, includeDrafts: preview}),
    listDisciplineLevels({tenantId, locale, includeDrafts: preview})
  ]);

  return {categories, levels};
}

export async function getRelatedDisciplines({
  tenantId,
  locale,
  excludeSlug,
  limit,
  preview
}: {
  tenantId: string;
  locale: 'vi' | 'en';
  excludeSlug: string;
  limit?: number;
  preview?: boolean;
}) {
  return getDisciplineSuggestions({
    tenantId,
    locale,
    excludeSlug,
    limit,
    includeDrafts: preview
  });
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
