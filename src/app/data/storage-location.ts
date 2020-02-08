
export class StorageLocation {
  storageLocationId: number;
  inConv: boolean;
  room: string;
  space: string;
  location: string;
}

export function storageLocationToString(location: StorageLocation, defaultValue: string = ''): string {
  if (location) {
    const parts = [];

    if (location.room) {
      parts.push(location.room);
    }
    if (location.space) {
      parts.push(location.space);
    }
    if (location.location) {
      parts.push(location.location);
    }

    return parts.join(' > ') + ' [' + (location.inConv ? 'EnConv' : 'HorsConv') + ']';
  } else {
    return defaultValue;
  }
}
