$(function (){



var socket = io.connect('http://127.0.0.1:3333'); 

const app = new Vue({
	el:'#app',
	data(){
		return {
			showChat:false,
			username:'',
			password:'',
			c_room:'',
			message:'',
			messages:[],
			online_user:'',
			event:'',
			rooms:['Hager' , 'mo\'men' , 'Ahmed' , 'Dina'],
		};
	},

	created(){

		socket.on('message', function(data) {

			if (data.type == 'message') {
				this.messages.push(data);		
			}else {
				this.event = data.message;
				this.online_user = data.online_user;	
			}	
     
      	}.bind(this) );
	},

	methods:{
		goChat(){
			if (this.username && this.password) {
				this.showChat = true;
				this.joinRoom('Hager');
			}
		},

		goLogout(){
			
			socket.emit('logout' , this.username);

			Object.keys(this.$data).map( key=>{
				if(key == 'showChat') this.$data.showChat = false;

				this.$data.key = null;
			});
		},

		sendMessage(){

			if(this.message != ''){
				socket.emit('message' , this.message , this.username , this.c_room);
				
				var data = {
					message  :this.message,
					username :this.username
				};
				
				this.messages.push( data );
				this.message = '';
				this.stopTyping();
				
			}

			
		},

		typing(){
			if(this.message != ''){
				socket.emit('typing' , this.username);	
			}
			
		},

		stopTyping(){
			socket.emit('stopTyping' , this.username);
		},

		joinRoom(room){
			if(this.c_room != ''){
				socket.emit('leaveroom' , this.username , this.c_room);
			}
			this.c_room = room;
			this.messages = [];
			socket.emit('joinroom' , this.username , this.c_room);
		}

	}
});
	
});
