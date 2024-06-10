import { Iurun } from "./iurun"

export interface Imakbuz {
    _id?:string,
    makbuzSeriNo?:string
    makbuzNo?:number,
    urunler?:Array<{urun:Iurun,adet:Number}>,
    makbuzMutemetBolgesi:string,
    makbuzTarihi?:Date,
    makbuzKaydeden:string,
    makbuzDegistiren?:string,
    makbuzDegistirmeTarihi?:Date,
    makbuzTutari?:number,
    tcnoVergiNo:number,
    isletmeAdiAdSoyad:string,
    isletmeAdres?:string,
    makbuzOdemeAlan?:string,
    makbuzAsamasi?:string,
    evrakKayitNumarasi:number,
    odemeSekli:string
}