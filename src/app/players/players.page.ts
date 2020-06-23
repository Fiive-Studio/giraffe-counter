import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  playersCount: number;
  players: string[];
  showPlayers: boolean;

  constructor(private utils: UtilsService) { }

  ngOnInit() {
    this.showPlayers = false;
  }

  processPlayersCount() {
    if (this.validateCount()) { 
      this.showPlayers = true;
      this.players = new Array<string>(this.playersCount);
    }
  }

  validateCount(): boolean {

    if (this.utils.isNullOrUndefined(this.playersCount)) {
      this.utils.showAlert("Error", "Debe digitado el número de jugadores");
      return false;
    }

    if (this.playersCount < 2 || this.playersCount > 5) {
      this.utils.showAlert("Error", "El número debe ser entre 2 y 5");
      return false;
    }

    return true;
  }

  fixCount(){
    this.showPlayers = false;
  }
}
