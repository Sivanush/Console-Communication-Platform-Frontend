import { Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MainSidebarComponent } from "../main-sidebar/main-sidebar.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServerService } from '../../../../service/server/server.service';
// import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { IServer } from '../../../../interface/server/serverDetails';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';


interface TreeNode {
  label: string;
  children: ChannelNode[];
  expanded: boolean;
}

interface ChannelNode {
  _id: string;
  label: string;
  type: 'text' | 'voice' | 'video';
}


@Component({
    selector: 'app-server-sidebar',
    standalone: true,
    templateUrl: './server-sidebar.component.html',
    styleUrl: './server-sidebar.component.scss',
    imports: [MainSidebarComponent,TreeModule,FormsModule,CommonModule,AsyncPipe,RouterLink]
})
export class ServerSidebarComponent {

  @Output() toggleChat = new EventEmitter<boolean>()
  @Output() channelSelected = new EventEmitter<string>();
  
  server: IServer = {
    name: '',
    _id: '',
    image: '',
    owner: '',
    id: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
    categories: []
  }
  treeData: TreeNode[] = [];

  constructor(private route: ActivatedRoute,private serverService:ServerService) {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['serverId'] && changes['serverId'].currentValue) {
      this.loadServerDetails(changes['serverId'].currentValue);
    }
  }



  ngOnInit(): void {

    
    this.route.params.subscribe(params =>{
      const serverId = params['serverId']
      this.loadServerDetails(serverId);

    // console.log(this.server);
    })
    
  }

  onChannelClick(channel: ChannelNode) {
    if (channel.type === 'text') {
      this.toggleChat.emit(true);
      this.channelSelected.emit(channel._id);
    }else{
      this.toggleChat.emit(false);
      // You might still want to emit the channel ID for non-text channels
      // If not, you can remove the next line
      this.channelSelected.emit(channel._id);
    }
  }


  loadServerDetails(serverId:string){
    this.serverService.getServerDetails(serverId).subscribe({
      next:(response)=>{
        this.server = response;
        this.treeData = this.transformServerToTreeData(this.server);
        // console.log('⚽⚽',this.server);
        
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  transformServerToTreeData(server: IServer): TreeNode[] {
    return server.categories.map(category => ({
      
      label: category.name,
      expanded: true,
      children: category.channels.map(channel => ({
        label: channel.name,
        type: channel.type, // Assuming channel has a 'type' property
        _id: channel._id
      }))
    }));
  }

  
  toggleCategory(category: TreeNode) {
    category.expanded = !category.expanded;
  }
}
