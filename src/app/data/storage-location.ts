
export class StorageLocation {
  storageLocationId: number;
  inConv: boolean;
  room: string;
  space: string;
  location: string;
}

export function storageLocationToString(loc: StorageLocation) {
  if (!loc) {
    return '';
  }

  const level2 = loc.space + ' > ' + loc.location;
  return loc.inConv ? level2 : loc.room + ' > ' + level2;
}
