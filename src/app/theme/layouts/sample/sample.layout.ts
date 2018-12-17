import { Component, OnDestroy, Input } from '@angular/core';
import { Observable} from 'rxjs';
import { delay, withLatestFrom, takeWhile, map, take, tap } from 'rxjs/operators';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { StateService } from '../../../core/data/state.service';

// TODO: move layouts into the framework
@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <nb-layout [center]=true windowMode>
      <nb-layout-header fixed>
        <ngx-header [position]="'normal'"></ngx-header>
      </nb-layout-header>

      <nb-sidebar state="collapsed" class="menu-sidebar"
                     tag="menu-sidebar"
                     responsive
                     [end]=false>
                     <ng-content select="nb-menu"></ng-content>
        </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

 
      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>

    </nb-layout>
  `,
})
export class SampleLayoutComponent implements OnDestroy {

  layout: Observable<any>;
  sidebar: Observable<any>;

  private alive = true;

  currentTheme: string;

  constructor(protected stateService: StateService,
              protected menuService: NbMenuService,
              protected bpService: NbMediaBreakpointsService,
              protected themeService: NbThemeService,
              protected sidebarService: NbSidebarService) {
    
      const isBp = this.bpService.getByName('is');
      this.menuService.onItemSelect()
        .pipe(
          takeWhile(() => this.alive),
          withLatestFrom(this.themeService.onMediaQueryChange()),
          delay(20),
        )
        .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {
  
          if (bpTo.width <= isBp.width) {
            this.sidebarService.collapse('menu-sidebar');
          }
        });
      }

  ngOnDestroy() {
    this.alive = false;
  }
}
