const password = document.querySelector("#password");
const alerts = document.querySelectorAll("#alert");
const confirmPassword = document.querySelector("#confirmPassword");
const format = /[ ~#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/;
var specialChar = false, passLength = false, passMatch = false;

function disableButton(bool){
   document.querySelector("#button-submit").disabled = bool;
}

disableButton(true);

password.addEventListener("keyup", function(e) {
   if (this.value.length < 8) {
      passLength = false;
      alerts[0].classList.remove("invisible")
   } else {
      passLength = true;
      alerts[0].classList.add("invisible")
   }

   if (format.test(this.value)) {
      specialChar = false;
      alerts[2].classList.remove("invisible");
   }else{
      specialChar = true;
      alerts[2].classList.add("invisible");
   }

   disableButton(!(specialChar && passMatch && passLength));
});

confirmPassword.addEventListener("keyup", function(e){
   if (this.value == password.value) {
      passMatch = true;
      alerts[1].classList.add("invisible");
   } else {
      passMatch = false;
      alerts[1].classList.remove("invisible");
   }

   disableButton(!(specialChar && passMatch && passLength));
});