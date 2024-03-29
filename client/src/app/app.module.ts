import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { DateInputComponent } from './_forms/date-input/date-input.component';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/meme-management/meme-management.component';
import { RolesModalComponent } from './modals/roles-modal/roles-modal.component';
import { ConfirmDialogComponent } from './modals/confirm-dialog/confirm-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MemeUploadComponent } from './memes/meme-upload/meme-upload.component';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmPasswordSentComponent } from './confirm-password-sent/confirm-password-sent.component';
import { ConnectionService } from './_services/connection.service';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { AboutModalComponent } from './modals/about-modal/about-modal.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { AuthenticationService } from './_services/authentication.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './_guards/auth.guard';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { MemeCardComponent, SafePipe } from './memes/meme-card/meme-card.component';
import { MemeDetailComponent } from './memes/meme-detail/meme-detail.component';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { DatePipe, registerLocaleData } from '@angular/common';
import { MemeSearchComponent } from './memes/meme-search/meme-search.component';
import { MemeRandomComponent } from './memes/meme-random/meme-random.component';
import { MemeListComponent } from './memes/meme-list/meme-list.component';
import { MemeTitleInputComponent } from './_forms/meme-title-input/meme-title-input.component';
import { IsMobileDirective } from './_directives/is-mobile.directive';
import { TopButtonsComponent } from './memes/top-buttons/top-buttons.component';
import { NgxLinkPreviewModule } from 'ngx-link-preview';
import { LinkPreviewComponent } from './memes/link-preview/link-preview.component';
import localePl from '@angular/common/locales/global/pl';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BanModalComponent } from './modals/ban-modal/ban-modal.component';
import { UserCardComponent } from './admin/user-card/user-card.component';
import { CommentComponent } from './memes/comment/comment.component';
import { AdminDeleteMemeComponent } from './modals/admin-delete-meme/admin-delete-meme.component';
import { DivisionViewComponent } from './memes/division-view/division-view.component';
import { AdminMemeViewComponent } from './modals/admin-meme-view/admin-meme-view.component';
import { ReplyComponent } from './memes/reply/reply.component';
import { SiteManagementComponent } from './admin/site-management/site-management.component';
import { NotificationsModalComponent } from './modals/notifications-modal/notifications-modal.component';
import { FavouriteComponent } from './memes/favourite/favourite.component';
import { MemeCardFavouriteComponent } from './memes/meme-card-favourite/meme-card-favourite.component';
import { ChangePasswordComponent } from './members/change-password/change-password.component';
import { MemberCommentsComponent } from './members/member-comments/member-comments.component';
import { MemberRepliesComponent } from './members/member-replies/member-replies.component';
import { MemeForApprovalCardComponent } from './admin/meme-for-approval-card/meme-for-approval-card.component';
import { SwitchDivisionComponent } from './modals/switch-division/switch-division.component';
import { MessageComponent } from './members/message/message.component';
import { RemoveUserComponent } from './modals/remove-user/remove-user.component';
import { RemoveAccountComponent } from './modals/remove-account/remove-account.component';
import { StatuteComponent } from './modals/statute/statute.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailComponent,
    ListsComponent,
    MessagesComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DateInputComponent,
    MemberMessagesComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModalComponent,
    ConfirmDialogComponent,
    MemeUploadComponent,
    ConfirmPasswordSentComponent,
    FooterComponent,
    AboutComponent,
    AboutModalComponent,
    ContactFormComponent,
    ResetPasswordComponent,
    MemeCardComponent,
    MemeDetailComponent,
    MemeSearchComponent,
    MemeRandomComponent,
    MemeListComponent,
    MemeTitleInputComponent,
    IsMobileDirective,
    TopButtonsComponent,
    LinkPreviewComponent,
    SafePipe,
    BanModalComponent,
    UserCardComponent,
    CommentComponent,
    AdminDeleteMemeComponent,
    DivisionViewComponent,
    AdminMemeViewComponent,
    ReplyComponent,
    SiteManagementComponent,
    NotificationsModalComponent,
    FavouriteComponent,
    MemeCardFavouriteComponent,
    ChangePasswordComponent,
    MemberCommentsComponent,
    MemberRepliesComponent,
    MemeForApprovalCardComponent,
    SwitchDivisionComponent,
    MessageComponent,
    RemoveUserComponent,
    RemoveAccountComponent,
    StatuteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    NgbModule,
    NgxLinkPreviewModule,
    ImageCropperModule,
    TimeagoModule.forRoot({formatter: { provide: 
      TimeagoFormatter, useClass: TimeagoCustomFormatter },}),
    RouterModule.forRoot([
      { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() { 
        return localStorage.getItem('token');
        } 
     }
   })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: "pl", useFactory: (sessionService) => sessionService.getLocale()},
    [TimeagoIntl],
    [DatePipe],
    AuthGuard,
    CookieService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }