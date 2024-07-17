import { Component, Input } from '@angular/core';
import { FriendsSidebarComponent } from "../shared/friends-sidebar/friends-sidebar.component";
import { FriendsHeaderComponent } from "../shared/friends-header/friends-header.component";
import { ServerSidebarComponent } from "../shared/server-sidebar/server-sidebar.component";
import { CommunityChatComponent } from "../shared/community-chat/community-chat.component";

@Component({
    selector: 'app-server-details',
    standalone: true,
    templateUrl: './server-details.component.html',
    styleUrl: './server-details.component.scss',
    imports: [FriendsSidebarComponent, FriendsHeaderComponent, ServerSidebarComponent, CommunityChatComponent]
})
export class ServerDetailsComponent {
    isChat:boolean = true

    isChatToggle(value:boolean){
        this.isChat = value
    }
}
