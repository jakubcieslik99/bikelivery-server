export default interface Trip {
  id: string;
  start_address: string;
  destination_address: string;
  date: string;
  distance: string;
  price: string;
  user_id?: string;
}
