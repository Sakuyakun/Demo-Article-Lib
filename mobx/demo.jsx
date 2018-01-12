// https://codepen.io/orliph/pen/pgmGjr?editors=1010

console.clear();

//Importing all needed modules by destructuring
const { observable, action, computed } = mobx;
const { observer } = mobxReact;
const { Component } = React;

//Enforcing Mobx Strict Mode
mobx.useStrict(true);

/*Mobx Store*/
class UserStore {
	//Observable values can be watched by Observers
	@observable users = [];
	@observable selectedUser = {};
	@computed get selectedId() { 
		return this.selectedUser.id;
	}

	constructor() {
		//Managing Async tasks like ajax calls with Mobx actions
		$.get('https://jsonplaceholder.typicode.com/users').then( users => { 
			this.setUsers(users); 
		});
	}
	//In strict mode, only actions can modify mobx state
	@action setUsers(users) {
		this.users = [...users];
	}
	@action selectUser(user) {
		this.selectedUser = user;
	}
}

//Child Component / Profile (Functional Component)
const Profile = ({ onClick, label, selected }) => {
	const classes = selected ? 'bold' : '';
	return (
		<li onClick={ onClick } className={classes}>
			<i className="fa fa-user"></i> { label } 
		</li>
	);
};

//Child Component /  (Functional Component)
const Selection = ({ user }) => {
	return (
		<ul>
			<li><i className="fa fa-book fa-fw"></i> Name: {user.name}</li>
			<li><i className="fa fa-user fa-fw"></i> Username: { user.username }</li>
			<li><i className="fa fa-phone fa-fw"></i> Phone: {user.phone}</li>
			<li>
				<i className="fa fa-envelope fa-fw"></i> Email: 
				<a href={"mailto:"+user.email}>{user.email}</a>
			</li>
		</ul>
	);
};

//Main Component / Parent Component / App (Class Based Component)
//Observers can react (ba dum tss) to changes in observables
@observer
class App extends React.Component {  
	renderSelection(){
		if (_.isEmpty(this.props.store.selectedUser)) return <noscript />;
		return (
			<div className='selection'>
				<Selection user={this.props.store.selectedUser}/>
				<button onClick={() => {this.props.store.selectUser({})}}>Close Profile</button>
			</div>
		)
	}

	renderProfiles(){
		return this.props.store.users.map((user) => {
			return (
				<Profile
					selected = {user.id === this.props.store.selectedId}
					key = {user.id} 
					label = {user.name} 
					onClick = { () => {this.props.store.selectUser(user)} }
					/>
			);
		});
	}

	render(){
		return (
			<div>
				<h3>Employee Directory</h3>
				{this.renderSelection()}
				{this.renderProfiles()}
			</div>
		);
	}
}

/*Implementation Details*/
//Creating a new Mobx Store Object for our App
const Store = new UserStore();

//Rendering the app to the container and passing in the Mobx Store
ReactDOM.render( <App store={Store} />, document.querySelector("#container"));