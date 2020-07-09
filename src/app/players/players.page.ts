import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { PersistenceService } from '../services/persistence.service';
import { PlayersService } from '../services/players.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  playersCount: number;
  showPlayers: boolean;
  rCountType: string;

  constructor(private utils: UtilsService
    , private playerService: PlayersService
    , private persistence: PersistenceService) { }

  ngOnInit() {
    this.validateStorageData();
  }

  async validateStorageData() {
    const result = await this.persistence.getValue(this.persistence.PLAYER_COUNT);
    if (result != null) {
      this.playersCount = parseInt(result);
      this.showPlayers = true;
    } else {
      this.showPlayers = false;
    }
  }

  processPlayersCount() {
    if (this.validateCount()) {
      this.playerService.setCountType(this.rCountType);
      this.showPlayers = true;
    }
  }

  validateCount(): boolean {

    if (this.utils.isNullOrUndefined(this.playersCount)) {
      this.utils.showAlert("Error", "Debe digitar el número de jugadores");
      return false;
    }

    if (this.playersCount < 2 || this.playersCount > 5) {
      this.utils.showAlert("Error", "El número debe ser entre 2 y 5");
      return false;
    }

    if (this.rCountType == undefined) {
      this.utils.showAlert("Error", "Debe seleccionar el estilo de conteo");
      return false;
    }

    return true;
  }

  fixCount() {
    this.utils.showAlertDecision("Giraffe", "¿Esta seguro de desea borrar los datos guardados?", () => {
      this.persistence.clear();
      this.playerService.resetValues();
      this.showPlayers = false;
    });
  }
}
