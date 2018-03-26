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
```css
    clientId: The id of registrated client at BL.
    redirectURI: Registrated redirect URL.
    scope: Requested scope. 
    returnURL: Return URL (optional). 
    width: Width of login popup (optional).
    height: Height of login popop (optional).
    env: Environment - dev, test, empty for production (optional).
```

### Login
```javascript
BLAuth.login((res) => {
    console.log('Logged in user:' + res.name);
});
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

