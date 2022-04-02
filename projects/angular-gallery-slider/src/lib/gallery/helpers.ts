import { constants } from './constants';

const { BASE_ITEM_SIZE } = constants;

export const getUpdatedSize = (
  size: number,
  galleryItemLength: number
): number => {
  if (galleryItemLength < BASE_ITEM_SIZE) {
    return BASE_ITEM_SIZE;
  }

  if (Boolean(size) && typeof size === 'number') {
    if (size < BASE_ITEM_SIZE) {
      return BASE_ITEM_SIZE;
    }

    return size > galleryItemLength ? galleryItemLength : size;
  }

  return BASE_ITEM_SIZE;
};
