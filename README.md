# Blinfo Authjs 
A javascript library, meant for browser use, to authenticate and authorize users against Björn Lundén Information.

## Installation
```
npm install @blinfo/authjs
```

## For vanilla javascript projects
### Load script 
```html
<script src="blauth-min.js" type="text/javascript"></script>
```

### Initialize
```javascript
BLAuth.init({ clientId: 'your-client-id', redirectURI: 'your-redirect-url', scope: 'requested-scope'});
BLAuth.getLoginStatus((res) => {
    console.log('Logged in user:' + res.name);
});
```

#### Init option params

* __clientId__: string - The id of registrated client at BL.
* __redirectURI__: string - Registrated redirect URL.
* __scopes__: string[] (optional) - Requested scopes. If no scope is provided, then the id scope USER_IDENTITY will be used.
* __returnURL__: string (optional) - Return URL. 
* __width__: number (optional) - Width of login popup.
* __height__: number (optional) - Height of login popup.
* __env__: string (optional) - Environment (dev, test or empty for production).


### Login
```javascript
BLAuth.login((res) => {
    console.log('Logged in user:' + res.name);
});
```

### Response
```typescript
export interface BLUser {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    authToken: string;
}
```

### Logout
```javascript
BLAuth.logout(res => {
    console.log("User logged out");
});
```

## For Angular projects
Create a service and make sure the service is loaded at the redirect url.

```javascript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as blauth from '@blinfo/authjs';

@Injectable()
export class Auth2Service {

    private _authState: BehaviorSubject<blauth.BLUser> = new BehaviorSubject(null);

    get authState(): Observable<blauth.BLUser> {
        return this._authState.asObservable();
    }
    constructor() {
        blauth.init({ clientId: 'your-client-id', redirectURI: 'your-redirect-url', scope: 'requested-scope' });
        blauth.getLoginStatus((user: blauth.BLUser) => {
            this._authState.next(user);
        });
    }

    login() {
        blauth.login((user: blauth.BLUser) => {
            this._authState.next(user);
        });
    }
    logout() {
        blauth.logout(() => {
            this._authState.next(null);
        });
    }
}
```

