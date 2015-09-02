interface Person {
    firstname: string;
    lastname: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}

var user = {firstname: "Jane", lastname: "User"};
enum Color {Red = 1, Green=2, Blue=4};
var color =Color.Green;
document.body.innerHTML = greeter(user);