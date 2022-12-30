export default interface Station{
  place_id:string,
  name:string,
  address:string,
  lat:number,
  lng:number,
  pano_id?:string,
  heading:number
}