import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PersistenceService } from './services/persistence.service';
import { PlayersService } from './services/players.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Jugadores',
      url: '/players',
      icon: 'people'
    },
    {
      title: 'Resultados',
      url: '/results',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private persistence: PersistenceService,
    private playersService: PlayersService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.validateStorageData();
  }

  async validateStorageData() {
    const result = await this.persistence.getValue(this.persistence.PLAYER_COUNT);
    if (result != null) {
      this.playersService.setPlayersCount(parseInt(result));

      const data = await this.persistence.getObject(this.persistence.PLAYER_LIST);
      this.playersService.setPlayers(data);
    }
  }
}
