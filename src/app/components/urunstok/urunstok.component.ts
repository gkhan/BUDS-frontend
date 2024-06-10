import { Component, OnInit } from '@angular/core';
import { UrunStokService } from 'src/app/services/urun-stok.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-urunstok',
  templateUrl: './urunstok.component.html',
  styleUrls: ['./urunstok.component.css'],
})
export class UrunstokComponent implements OnInit {
  displayedColumns: string[] = [
    'stokBolge',
    'urunAdi',
    'stok',
    'guncellenmeTarihi',
    'islem',
  ];
  dataSource1: any;
  loading: boolean = false;

  constructor(
    public userService: UserService,
    public urunstokService: UrunStokService
  ) {}

  ngOnInit(): void {
    this.loading=true
    this.urunstokService.getUrunStoks().subscribe({
      next: (v) => {
        this.dataSource1 = v;
      },
      error: (e) => {
        console.log('geçersiz token hatası', e);
        this.userService.logOut();
      },
      complete: () => {
        this.loading=false
      },
    });
  }
}
