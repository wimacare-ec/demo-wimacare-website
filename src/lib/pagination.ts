export const ARCHIVE_PAGE_SIZE = 9;

export const totalArchivePages = (totalEntries: number) =>
  Math.max(1, Math.ceil(totalEntries / ARCHIVE_PAGE_SIZE));

export const archivePageEntries = <T>(entries: T[], page: number) => {
  const start = (page - 1) * ARCHIVE_PAGE_SIZE;
  return entries.slice(start, start + ARCHIVE_PAGE_SIZE);
};
