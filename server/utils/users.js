// class Users {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   addUser
//   getDescription() {
//     return `${this.name} is ${this.age} year(s) old.`
//   }
// }
// var me = new Person('Bala', 24);
// console.log(me.getDescription());

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    //return user taht was removed
    var user = this.getUser(id);
    if(user) {
      this.users = this.users.filter((user, index) => user.id !== id);
    }
    return user;
  }
  getUser(id) {
    //return user with id
    var user = this.users.filter((user) => user.id === id);
    return user[0];
  }
  getUserList(room) {
    //User names in the room
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

var newUser = new Users();
var addUser  = newUser.addUser('sdfsd', 'sdsd', 'sdfsdfsd');
console.log(addUser);
module.exports = {Users};
