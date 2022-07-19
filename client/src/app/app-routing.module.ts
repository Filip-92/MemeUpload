import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberDetailedResolver } from './_resolvers/member-detailed.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { RegisterComponent } from './register/register.component';
import { AdminGuard } from './_guards/admin.guard';
import { AboutComponent } from './about/about.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { MemeDetailComponent } from './memes/meme-detail/meme-detail.component';
import { MemeRandomComponent } from './memes/meme-random/meme-random.component';
import { MemeListComponent } from './memes/meme-list/meme-list.component';
import { MemeSearchComponent } from './memes/meme-search/meme-search.component';
import { DivisionViewComponent } from './memes/division-view/division-view.component';
import { FavouriteComponent } from './memes/favourite/favourite.component'

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'ulubione', component: FavouriteComponent},
      {path: 'memes/szukaj/:search', component: MemeSearchComponent},
      {path: 'szukaj/uzytkownicy', component: MemeSearchComponent},
      {path: 'szukaj/memes', component: MemeSearchComponent},
      {path: 'memes/losowe/:id', component: MemeRandomComponent},
      {path: 'meme/:id/:title', component: MemeDetailComponent},
      {path: 'meme/:id', component: MemeDetailComponent},
      {path: 'uzytkownicy', component: MemberListComponent},
      {path: 'strona/:pageNumber', component: HomeComponent},
      {path: 'kategoria/:divisionName', component: HomeComponent},
      {path: 'ostatnie24H/strona/:pageNumber', component: HomeComponent},
      {path: 'ostatnie24H', component: HomeComponent},
      {path: 'ostatnie48H', component: HomeComponent},
      {path: 'poczekalnia/:id', component: MemeDetailComponent},
      {path: 'poczekalnia/strona/:pageNumber', component: HomeComponent},
      {path: 'poczekalnia', component: HomeComponent},
      {path: 'uzytkownicy/:username', component: MemberDetailComponent, resolve: {member: MemberDetailedResolver}},
      {path: 'uzytkownik/edycja', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: 'lists', component: ListsComponent},
      {path: 'wiadomosci', component: MessagesComponent},
      {path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]},
      {path: 'reset-password', component: ResetPasswordComponent },
      {path: 'about', component: AboutComponent},
      {path: 'zapomnialem-hasla', component: ForgotPasswordComponent, canActivate: [AuthGuard], data: { requiresLogin: false } },
    ]
  },
  {path: 'errors', component: TestErrorsComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent },
  {path: 'about', component: AboutComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }