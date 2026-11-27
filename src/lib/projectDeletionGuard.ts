export type DeletionState = { isDeleted?: boolean; publicationStatus?: string } | null | undefined;

/** A deletion/archive marker is one-way and must never be cleared by UI writes. */
export function isProjectDeletionLocked(...records: DeletionState[]): boolean {
  return records.some(record =>
    record?.isDeleted === true ||
    record?.publicationStatus === 'Archived' ||
    record?.publicationStatus === 'Rejected'
  );
}
