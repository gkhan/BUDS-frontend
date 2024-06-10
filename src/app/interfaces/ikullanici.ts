export interface Ikullanici{
    _id?:string,
    kullaniciAdi:string,
    email:string,
    password:string,
    kullaniciBolge:string,
    kullaniciRol:string,
    KullaniciKayitTarihi?:Date,
    token?:string,
    kullaniciAktifMi?:boolean
}