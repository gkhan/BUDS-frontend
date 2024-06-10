export interface IurunStok{
    _id?:string,
    urunID?:string,
    urunAdi?:string,
    stok?:number,
    stokBolge?:string,
    olusturulmaTarihi?:Date,
    kimTarafindanOlusturuldu?:string,
    kimTarafindanGuncellendi?:string,
    guncellenmeTarihi?:Date,
    aktifMi?:boolean
}