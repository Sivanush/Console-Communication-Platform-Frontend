import { Component } from '@angular/core';
import { MainSidebarComponent } from "../main-sidebar/main-sidebar.component";
import { ActivatedRoute } from '@angular/router';
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
  label: string;
  type: 'text' | 'voice' | 'video';
}


@Component({
    selector: 'app-server-sidebar',
    standalone: true,
    templateUrl: './server-sidebar.component.html',
    styleUrl: './server-sidebar.component.scss',
    imports: [MainSidebarComponent,TreeModule,FormsModule,CommonModule,AsyncPipe]
})
export class ServerSidebarComponent {

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

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      const serverId = params['serverId']
      this.loadServerDetails(serverId);
    })
  }


  loadServerDetails(serverId:string){
    this.serverService.getServerDetails(serverId).subscribe({
      next:(response)=>{
        this.server = response;
        this.treeData = this.transformServerToTreeData(this.server);
        console.log('⚽⚽',this.server);
        
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
        type: channel.type // Assuming channel has a 'type' property
      }))
    }));
  }

  
  toggleCategory(category: TreeNode) {
    category.expanded = !category.expanded;
  }
}
