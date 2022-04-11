import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UsuarioLoginLdapDto } from './../_dto/usuarioLoginLdapDto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = `${environment.HOST}/oauth/token`;
  urlLdap: string = `${environment.HOST}/login/usuariologinldap`
  mensajeCambio = new Subject<string>();
  rptaLogin : number;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loginLdap(usuarioLoginLdap : UsuarioLoginLdapDto){  
    return this.http.post<boolean>(this.urlLdap, usuarioLoginLdap);
  }

  login(usuario: string, contrasena: string){
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;
    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 
                                      'application/x-www-form-urlencoded; charset=UTF-8').
                                set('Authorization',
                                    'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD)
                                  )
    });
  }

  estaLogeado(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    if(token){
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['inicio']);
      });
    }else{
      sessionStorage.clear();
      this.router.navigate(['inicio']);
    }
  }
}
