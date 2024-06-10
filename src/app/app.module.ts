import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogInComponent } from './components/log-in/log-in.component';
import { HomeComponent, urunDegistirDialog, urunEkleDialog } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { UrunService } from './services/urun.service';
import { MakbuzComponent, makbuzOlusturmaDialog } from './components/makbuz/makbuz.component';
import { MakbuzService } from './services/makbuz.service';
import { KasaComponent, kasaMakbuzKaydetDialog } from './components/kasa/kasa.component';
import { KasaService } from './services/kasa.service';
import { KullaniciComponent, kullaniciEkleDialog } from './components/kullanici/kullanici.component';
import { FirmaService } from './services/firma.service';
import { BolgebirimComponent,bolgebirimDegistirDialog,bolgebirimEkleDialog } from './components/bolgebirim/bolgebirim.component';
import { BolgebirimService } from './services/bolgebirim.service';
import { SayacService } from './services/sayac.service';
import { SayacComponent, sayacDegistirDialog, sayacEkleDialog } from './components/sayac/sayac.component';
import { FirmaComponent } from './components/firma/firma.component';
import { KmakbuzComponent } from './components/kmakbuz/kmakbuz.component';
import { UrunStokService } from './services/urun-stok.service';
import { StokKabulService } from './services/stok-kabul.service';
import { StokkabulComponent, stokkabulOlusturmaDialog } from './components/stokkabul/stokkabul.component';
import { UrunstokComponent } from './components/urunstok/urunstok.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    HomeComponent,
    urunEkleDialog,
    urunDegistirDialog,
    kullaniciEkleDialog,
    sayacEkleDialog,
    sayacDegistirDialog,
    bolgebirimEkleDialog,
    bolgebirimDegistirDialog,
    MakbuzComponent,
    makbuzOlusturmaDialog,
    KasaComponent,
    kasaMakbuzKaydetDialog,
    KullaniciComponent,
    BolgebirimComponent,
    SayacComponent,
    FirmaComponent,
    KmakbuzComponent,
    StokkabulComponent,
    UrunstokComponent,
    stokkabulOlusturmaDialog
  
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    
    ],
  providers: [UserService,UrunService,MakbuzService,KasaService,FirmaService,BolgebirimService,SayacService,UrunStokService,StokKabulService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
