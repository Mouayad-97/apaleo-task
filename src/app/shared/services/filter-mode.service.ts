import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterModeService {
  private readonly filterModeKey = 'filterMode';
  private filterModeSubject: BehaviorSubject<string | null>;

  constructor() {
    // Initialize the filter mode from localStorage or default to null
    const initialMode = localStorage.getItem(this.filterModeKey);
    this.filterModeSubject = new BehaviorSubject<string | null>(initialMode);
  }

  // Observable to get the current filter mode
  get filterMode$(): Observable<string | null> {
    return this.filterModeSubject.asObservable();
  }

  // Set the filter mode and save it in localStorage
  setFilterMode(mode: string): void {
    localStorage.setItem(this.filterModeKey, mode);
    this.filterModeSubject.next(mode);
  }
}
