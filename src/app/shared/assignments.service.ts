
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Assignment } from './../models/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
import {environment} from "../../environments/environment";
import {HttpRequestService} from "./../services/http-request.service";

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {

  url: string = environment.api_url + "assignments";
  assignments:Assignment[] = [];

  constructor(private loggingService:LoggingService, private http: HttpRequestService) {
    this.loggingService.setNiveauTrace(2);

  }

  getAssignments(page:number, limit:number, etat: any[] = [], matieres: any[] = []):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    //return this.http.get<Assignment[]>(this.url + "?page=" + page + "&limit=" + limit);
    const body = {
      page : page,
      etat : etat,
      matiere : matieres,
    }
    return this.http.post<Assignment[]>(this.url+"/etat", body)
  }

  getAssignment(id:string):Observable<Assignment|undefined> {
    return this.http.get<Assignment>(`${this.url}/${id}`);
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    }
  }

  addAssignment(body:any):Observable<any> {
    return this.http.post<Assignment>(this.url, body);

    //return of("Assignment ajouté");
  }

  updateAssignment(body:any):Observable<any> {

    return this.http.put<Assignment>(this.url, body);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.nom, "supprimé");

    //return of("Assignment supprimé");
    return this.http.delete(this.url + "/" + assignment._id);
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;
      newAssignment.id = a.id;

      this.addAssignment(newAssignment)
      .subscribe(reponse => {})})
  }

  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment:any = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
