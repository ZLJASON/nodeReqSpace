function greeter(person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}
var user = { firstname: "Jane", lastname: "User" };
var Color;
(function (Color) {
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Blue"] = 4] = "Blue";
})(Color || (Color = {}));
;
var color = Color.Green;
document.body.innerHTML = greeter(user);
