import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {StorageLocation, StorageTree} from '../data/storage-location';
import {environment} from '../../environments/environment';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class StorageLocationsService {
  private refresh$ = new BehaviorSubject(0);
  private locations$: Observable<StorageLocation[]>;
  private trees$: Observable<StorageTree[]>;
  private treesMap$: Observable<Map<number, StorageTree>>;
  private storagesWithParents$: Observable<Map<number, StorageTree>>;
  private lastPull = 0;

  constructor(private http: HttpClient) {
    this.locations$ = this.refresh$.pipe(
      switchMap((_) => this.http.get<StorageLocation[]>(environment.apiurl + '/locations')),
      shareReplay(1)
    );
    this.trees$ = this.refresh$.pipe(
      switchMap((_) => this.http.get<StorageTree[]>(environment.apiurl + '/storage/tree')),
      shareReplay(1)
    );
    this.treesMap$ = this.trees$.pipe(
      map(locations => {
        const locToAdd: StorageTree[] = []
        locations.forEach(l => locToAdd.push(l))

        const map = new Map<number, StorageTree>();
        while (locToAdd.length !== 0) {
          const elem = locToAdd.pop();
          elem.children.forEach(c => locToAdd.push(c));
          map.set(elem.storageId, elem);
        }

        return map;
      })
    );
    /*this.storagesWithParents$ = this.treesMap$.pipe(map(m => {
      const returnMap = new Map<number, StorageWithParents>()

      for (let entry of m.entries()) {
        let storage = entry[0]
        let elem = entry[1];
        const parents: StorageWithParents[] = [];
        // Go down the tree, filling the parents array
        while (elem != null) {
          const swp = new StorageWithParents();
          swp.storageId = elem.storageId;
          swp.event = elem.event;
          swp.storageName = elem.storageName;

          parents.push(swp)
          elem = m.get(elem.parentStorageId)
        }

        // Get parents one by one in reverse, starting with the root of that tree
        let ret: StorageWithParents = parents.pop();
        let current = parents.pop()
        while (current != null) {
          current.parent = ret
          ret = current
        }

        returnMap.set(storage, ret)
      }
      return returnMap;
    }))*/
    this.storagesWithParents$ = this.treesMap$.pipe(map(m => {
      const returnMap = new Map<number, StorageTree>();

      for (let entry of m.entries()) {

        let elem = entry[1];
        let tree: StorageTree = null;
        while (elem != null) {
          const swp = new StorageTree();
          swp.storageId = elem.storageId;
          swp.event = elem.event;
          swp.storageName = elem.storageName;
          swp.parentStorageId = elem.parentStorageId;
          swp.children = (tree == null ? [] : [tree]);

          tree = swp;
          elem = m.get(elem.parentStorageId);
        }

        returnMap.set(entry[0], tree);
      }
      return returnMap;
    }));
  }

  getStorages(): Observable<StorageTree[]> {
    return this.trees$;
  }

  getStorageTree(storage: number): Observable<StorageTree> {
    return this.treesMap$.pipe(map(m => m.get(storage)))
  }

  getStorageByParent(parent?: number): Observable<StorageTree[]> {
    return this.trees$.pipe(map(lst => lst.filter(elem => elem.parentStorageId === parent)));
  }

  getStorageWithParents(storage: number): Observable<StorageTree> {
    return this.storagesWithParents$.pipe(map(m => m.get(storage)));
  }

  getStoragesWithParents(inevent?: boolean, eventId?: number): Observable<Map<number, StorageTree>> {
    if (inevent === undefined && eventId === undefined) {
      return this.storagesWithParents$;
    } else {
      return this.storagesWithParents$.pipe(map(m => {
        const copy = new Map<number, StorageTree>();
        m.forEach((elem, key) => {
          if (elem.event === eventId || elem.event === undefined && inevent === false) {
            copy.set(key, elem);
          }
        });
        return copy;
      }))
    }
  }

  getStorageLocations(inConv?: boolean): Observable<StorageLocation[]> {
    this.pullIfNeeded();

    if (inConv === undefined || inConv == null) {
      return this.locations$;
    } else {
      return this.locations$.pipe(map(locations => locations.filter(loc => loc.inConv === inConv)));
    }
  }

  forceRefreshLocations() {
    this.lastPull = Date.now();
    this.refresh$.next(0);
  }

  getStorageLocation(num: number): Observable<StorageLocation> {
    this.pullIfNeeded();

    return this.locations$.pipe(map(locations => locations.filter(loc => loc.storageLocationId === num)[0]));
  }

  getStorageLocationsByRoomSpace(room: string, space?: string, inConv?: boolean): Observable<[StorageLocation | null, StorageLocation[]] | null> {
    return this.getStorageLocations(inConv)
      .pipe(map(all => {
        space = space?.trim()?.toLowerCase();
        room = room.trim().toLowerCase();

        const parent = all.find(loc => loc.room.trim().toLowerCase() === room && loc.space?.trim()?.toLowerCase() === space && loc.location === undefined);

        let filtered = all.filter(loc => loc.room.trim().toLowerCase() === room)
          .filter(r => r.storageLocationId !== parent?.storageLocationId);

        if (space !== null && space !== undefined) {
          filtered = filtered.filter(loc => loc.space?.trim()?.toLowerCase() === space);
        }

        if (inConv !== undefined) {
          filtered = filtered.filter(loc => loc.inConv === inConv);
        }

        return [parent, filtered];
      }));
  }

  createUpdateStorage(loc: StorageLocation): Observable<void> {
    if (loc.storageLocationId) {
      return this.http.put<void>(environment.apiurl + '/locations/' + loc.storageLocationId, loc);
    } else {
      return this.http.post<void>(environment.apiurl + '/locations', loc);
    }
  }

  deleteStorage(loc: number): Observable<void> {
    return this.http.delete<void>(environment.apiurl + '/locations/' + loc);
  }

  moveItems(loc: number, items: string[], moveType: boolean, moveAll: boolean): Observable<void> {
    return this.http.post<void>(environment.apiurl + '/locations/move/' + loc, {
      items, moveType, moveAll
    });
  }

  getStorageLocationsByParent(parentId: number, inConv?: boolean): Observable<[StorageLocation, StorageLocation[]]> {
    return this.getStorageLocations(inConv)
      .pipe(map(all => {
        const parent = all.find(loc => loc.storageLocationId === parentId);

        if (parent !== null) {
          let filtered = all.filter(loc => loc.room === parent.room)
            .filter(r => r.storageLocationId !== parentId);

          if (parent.location !== null && parent.location !== undefined) {
            return [parent, []];
          }

          if (parent.space !== null && parent.space !== undefined) {
            filtered = filtered.filter(loc => loc.space === parent.space);
          }

          return [parent, filtered];
        } else {
          return [null, []];
        }
      }));
  }

  getStorageLocationsAsMap(inConv?: boolean): Observable<Map<number, StorageLocation>> {
    return this.getStorageLocations(inConv).pipe(map(l => {
      const map = new Map<number, StorageLocation>();
      l.forEach(elem => map.set(elem.storageLocationId, elem));
      return map;
    }))
  }

  private pullIfNeeded() {
    const now = Date.now();

    if (now - this.lastPull > (60 * 1000)) {
      this.forceRefreshLocations();
    }
  }

}
