var member = ['abc', 'bcd', 'def'];
console.log(member[1]);
for(var i = 0; i<member.length ;i++){
  console.log('array ', member[i]);
}

var roles = {
  'programmer' : 'Jung',
  'designer' : 'Seung',
  'manager' : 'hoya'
};
console.log(roles.designer);
console.log(roles['designer']);

for(var name in roles){
  console.log('object ', name, ', value ', roles[name]);
}
