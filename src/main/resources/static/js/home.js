import { $ } from "./utils.js";

const bodyOverflowHandler = (state) => {
    const body = $("body");
    body.style.overflow = state;
}

const createRoomButton = $("#create__room__button");
const createRoomModal = $("#create__room__modal");
const openModalHandler = () => {
    createRoomModal.classList.toggle("open");
    bodyOverflowHandler("hidden");
}
createRoomButton.addEventListener("click", openModalHandler);

const modalCloseBtn = $("#modal__close__btn");
const closeModalHandler = () => {
    createRoomModal.classList.toggle("open");
    bodyOverflowHandler("auto");
}
modalCloseBtn.addEventListener("click", closeModalHandler);

window.addEventListener("click", ({target}) => {
    if(target.classList.contains("modal")){
        closeModalHandler();
    }
})