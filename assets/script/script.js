let modal = document.querySelector("#modal")

function confirm(){

    if (modal.classList.contains("displayModal")) {
        modal.classList.remove("displayModal")
        
    }else{
        modal.classList.add("displayModal")
    }
    
}