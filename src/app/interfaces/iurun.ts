export interface Iurun {
    _id?:string,
    urunKodu:string,
    urunAdi:string,
    stokGerekliMi:boolean,
    urunFiyat:number,
    olustrulmaTarihi?:Date,
    kaldirilmaTarihi?:Date,
    kimTarafindanOlusturuldu:string,
    urunAktifMi?:boolean,
    kdvOrani?:number
    
}
