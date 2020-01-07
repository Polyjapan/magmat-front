
export class StorageLocation {
  storageLocationId: number;
  inConv: boolean;
  room: string;
  space: string;
  location: string;
}

export function storageLocationToString(loc: StorageLocation, defaultValue: string = '') {
  if (!loc) {
    return defaultValue;
  }

  const level2 = loc.space + ' > ' + loc.location;
  return loc.room ? loc.room + ' > ' + level2 : level2;
}
