import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { PersistenceService } from '../services/persistence.service';
import { PlayersService } from '../services/players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  constructor(private playersService: PlayersService
    , private router: Router
    , private utils: UtilsService
    , private persistence: PersistenceService) { }

  ngOnInit() {
    this.validateStorageData();
  }

  playerChange($event: any, pos: number) {
    this.playersService.setPlayer($event.target.value, pos)
  }

  async validateStorageData() {
    const playerCount = this.playersService.getCount().length;

    if(playerCount === 0){
      const result = await this.persistence.getValue(this.persistence.PLAYER_COUNT);
      if (result != null) {
        this.playersService.setPlayersCount(parseInt(result));
      }else{
        this.router.navigateByUrl('/home');
      }
    }
  }

  goBack() {
    this.utils.showAlertDecision("Giraffe", "¿Esta seguro de regresar, se borraran los datos guardados?", () => {
      this.persistence.clear();
      this.playersService.resetValues();
      this.router.navigateByUrl('/home');
    });
  }

  goToResults() {
    if (this.playersService.validateNames()) {
      this.persistence.saveValue(this.persistence.PLAYER_COUNT, this.playersService.getPlayers().length.toString());
      this.persistence.saveObject(this.persistence.PLAYER_LIST, this.playersService.getPlayers());
      this.persistence.saveObject(this.persistence.COUNT_TYPE, this.playersService.getCountType());

      this.router.navigateByUrl('/results');
    }
  }
}
