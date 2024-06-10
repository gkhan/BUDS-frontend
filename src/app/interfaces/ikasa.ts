import { Imakbuz } from "./imakbuz";

export interface ikasa {
    _id?:string,
    kasaNo:number,
    makbuzlar:Array<Imakbuz>,
    kasaDefteriArsivMi:boolean,
    bankayaGonderimTarihi?:Date,
    bankayaGonderenKisi:string,
    kasaTutari:number,
    kasaAcilisTarihi?:Date,
    kasaBolgesi:string,
    dekontNo:number
}