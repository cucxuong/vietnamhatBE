export class CreateTournamentPlayerDto {
  full_name: string;
  email: string;
  nick_name: string | null;
  gender: string;
  current_country: string;
  selected_options: string;
  tournament: string;
}
