import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { HomeComponent } from './components/home/home.component';
import { MakbuzComponent } from './components/makbuz/makbuz.component';
import { KasaComponent } from './components/kasa/kasa.component';
import { KullaniciComponent } from './components/kullanici/kullanici.component';
import { BolgebirimComponent } from './components/bolgebirim/bolgebirim.component';
import { SayacComponent } from './components/sayac/sayac.component';
import { FirmaComponent } from './components/firma/firma.component';
import { KmakbuzComponent } from './components/kmakbuz/kmakbuz.component';
import { StokkabulComponent } from './components/stokkabul/stokkabul.component';
import { UrunstokComponent } from './components/urunstok/urunstok.component';

const routes: Routes = [
  {path:'',pathMatch:'full', redirectTo:'/'},
  {path:'login', component:LogInComponent},
  {path:'home',component:HomeComponent},
  {path:'makbuz',component:MakbuzComponent},
  {path:'kasa',component:KasaComponent},
  {path:'kullanici',component:KullaniciComponent},
  {path:'bolgebirim',component:BolgebirimComponent},
  {path:'sayac',component:SayacComponent},
  {path:'firma',component:FirmaComponent},
  {path:'kmakbuz',component:KmakbuzComponent},
  {path:'stokkabul',component:StokkabulComponent},
  {path:'urunstok',component:UrunstokComponent}





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
