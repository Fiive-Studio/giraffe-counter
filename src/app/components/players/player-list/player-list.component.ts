import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { PlayersService } from 'src/app/services/players.service';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {

  @Input() playersCount: number;

  constructor(private playersService: PlayersService
    , private router: Router
    , private persistence: PersistenceService) { }

  ngOnInit() {
    this.validateStorageData();
  }

  async validateStorageData() {
    const result = await this.persistence.getValue(this.persistence.PLAYER_COUNT);
    if (result == null) {
      this.playersService.setPlayersCount(this.playersCount);
    }
  }

  playerChange($event: any, pos: number) {
    this.playersService.setPlayer($event.target.value, pos)
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
