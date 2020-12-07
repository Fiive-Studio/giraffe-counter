import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { PersistenceService } from '../services/persistence.service';
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './counter-mode.page.html',
  styleUrls: ['./counter-mode.page.scss'],
})
export class CounterModePage implements OnInit {

  playersCount: number;
  rCountType: string;

  constructor(private utils: UtilsService
    , private playerService: PlayersService
    , private router: Router
    , private persistence: PersistenceService) { }

  ngOnInit() {
    this.validateStorageData();
  }  

  processPlayersCount() {
    if (this.validateCount()) {
      this.playerService.setCountType(this.rCountType);
      this.playerService.setPlayersCount(this.playersCount);
      this.navigateToPlayers();
    }
  }

  private navigateToPlayers(){
    this.router.navigateByUrl('/players');
  }

  private async validateStorageData() {
    const result = await this.persistence.getValue(this.persistence.PLAYER_COUNT);
    if (result != null) {
      this.navigateToPlayers();
    }
  }

  private validateCount(): boolean {

    if (!this.utils.isIntValue(this.playersCount)) {
      this.utils.showAlert("Error", "Debe digitar el número de jugadores y debe ser un número entero");
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
}
