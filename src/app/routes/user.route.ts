import { Routes } from '@angular/router';
import { SignupComponent } from '../components/user/signup/signup.component';
import { HomeComponent } from '../components/user/home/home.component';
import { LoginComponent } from '../components/user/login/login.component';
import { userAuthGuard } from '../guards/user/user-auth.guard';
import { userNotAuthGuard } from '../guards/user/user-not-auth.guard';
import { OtpComponent } from '../components/user/otp/otp.component';
import { otpGuardGuard } from '../guards/user/otp-guard.guard';
import { EmailSectionComponent } from '../components/user/forget-password/email-section/email-section.component';
import { PasswordSectionComponent } from '../components/user/forget-password/password-section/password-section.component';
import { AddFriendComponent } from '../components/user/add-friend/add-friend.component';
import { PendingRequestsComponent } from '../components/user/pending-requests/pending-requests.component';
import { AllFriendsComponent } from '../components/user/all-friends/all-friends.component';
import { DirectChatComponent } from '../components/user/direct-chat/direct-chat.component';
import { directChatGuard } from '../guards/user/direct-chat.guard';
import { ServerDetailsComponent } from '../components/user/server-details/server-details.component';
import { AcceptInviteComponent } from '../components/user/accept-invite/accept-invite.component';
import { DirectVideoCallComponent } from '../components/user/direct-video-call/direct-video-call.component';
import { ViewMembersComponent } from '../components/user/view-members/view-members.component';
import { DirectVoiceCallComponent } from '../components/user/direct-voice-call/direct-voice-call.component';
import { ProfileComponent } from '../components/user/profile/profile.component';
import { ExploreComponent } from '../components/user/explore/explore.component';
import { UsersProfileComponent } from '../components/user/users-profile/users-profile.component';
import { profileCheckGuard } from '../guards/user/profile-check.guard';


export const userRoute: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [userNotAuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: 'otp',
    component: OtpComponent,
    canActivate: [otpGuardGuard]
  },
  {
    path: 'forget-password',
    component: EmailSectionComponent
  },
  {
    path: 'reset-password/:token',
    component: PasswordSectionComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [userNotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'profile/:userId',
    component: UsersProfileComponent,
    canActivate:[userAuthGuard,profileCheckGuard]
  },
  {
    path: 'friend',
    canActivate: [userAuthGuard],
    children: [
      {
        path: 'add-friend',
        component: AddFriendComponent,
        canActivate: [userAuthGuard]
      },
      {
        path: 'pending-request',
        component: PendingRequestsComponent,
        canActivate: [userAuthGuard]
      },
      {
        path: 'all-friends',
        component: AllFriendsComponent,
        canActivate: [userAuthGuard]
      },
      {
        path: '',
        redirectTo: 'all-friends',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'direct-chat/:userId/:friendId',
    component: DirectChatComponent,
    canActivate: [directChatGuard, userAuthGuard]
  },
  {
    path: 'direct-video-chat/:userId/:friendId',
    component: DirectVideoCallComponent,
    canActivate: [directChatGuard, userAuthGuard]
  },
  {
    path: 'direct-voice-chat/:userId/:friendId',
    component: DirectVoiceCallComponent,
    canActivate: [directChatGuard, userAuthGuard]
  },
  {
    path: 'server/:serverId/:channelId',
    component: ServerDetailsComponent,
    canActivate:[userAuthGuard]
  },
  {
    path: 'invite/:inviteCode',
    component: AcceptInviteComponent,
  },
  {
    path: 'server/:serverId',
    component:ViewMembersComponent    
  },
  {
    path: 'explore',
    component:ExploreComponent
  }
];
