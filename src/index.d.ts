// Type definitions for [@blinfo/authjs]
// Definitions by: [Jon-Erik Liw, jon-erik.liw@blinfo.se] 

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace BLAuth;

/*~ If this module has methods, declare them as functions like so.
 */
export function init(options: AuthOptions): void;
export function login(callback: (value: BLUser) => void): void;
export function logout(callback: () => void): void;
export function getLoginStatus(callback: (value: BLUser) => void): void;

/*~ You can declare types that are available via importing the module */
export interface AuthOptions {
    clientId: string;
    redirectURI: string;
    scopes?: string[];
    returnURL?: string;
    width?: number;
    height?: number;
    env?: string;
}

export interface BLUser {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    authToken: string;
}
