import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';


@Component({
  selector: 'mb-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);
  private storageService = inject(StorageService);

  public goToConfig(): void {
    this.storageService.reOpenConfig();
    this.router.navigate(['config']);
  }
}
