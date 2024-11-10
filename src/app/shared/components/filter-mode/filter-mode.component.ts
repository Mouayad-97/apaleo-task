import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterModeService } from '@shared/services/filter-mode.service';

@Component({
  selector: 'app-filter-mode',
  standalone: true,
  imports: [],
  templateUrl: './filter-mode.component.html',
  styleUrl: './filter-mode.component.scss',
})
export class FilterModeComponent {
  showDialog = true;
  selectedMode: 'frontend' | 'backend' | null = null;
  modeSelection = output<'frontend' | 'backend'>();

  constructor() {}

  ngOnInit(): void {}

  confirmSelection(): void {
    if (this.selectedMode) {
      this.modeSelection.emit(this.selectedMode);
      this.showDialog = false;
    } else {
      alert('Please select a filtering mode.');
    }
  }
  selectMode(mode: 'frontend' | 'backend') {
    this.selectedMode = mode;
  }
}
