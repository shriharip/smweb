import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthStrategy, NbAuthService } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import.guard';
import { DataModule } from './data/data.module';



// const socialLinks = [
//   {
//     name: "facebook",
//     icon: 'socicon-facebook',
//   },
//   {
//     name: "google",
//     icon: 'socicon-google',
//   },
//   /*{
//     url: 'https://twitter.com/',
//     target: '_blank',
//     icon: 'socicon-twitter',
//   },*/
// ];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [

  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    /* providers: {
      email: {
        // service: NbDummyAuthProvider, // Not really needed any more
        config: {
          delay: 3000,
          login: {
            rememberMe: true,
          },
        },
      },
    }, */
    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
        delay: 3000,
      }),
    ],
    forms: {
      login: {
      },
      register: {
      },
      validation: {
        password: {
          required: true,
          minLength: 8,
          maxLength: 42,
        },
        email: {
          required: true,
        },
        fullName: {
          required: true,
          minLength: 4,
          maxLenght: 42,
        },
        company: {
          required: true,
          minLength: 3,
          maxLength: 42,
        }
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider, 
    }
  //AnalyticsService, https://github.com/GianlucaRi/ngx-admin/blob/master/src/app/%40core/core.module.ts
  
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}