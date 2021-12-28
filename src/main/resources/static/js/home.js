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

const chatInput = $("#chat__input");
const chatSubmitButton = $("#chat__submit__btn");
const messages = $("#messages");

chatSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    if(chatInput.value === "") {
        return;
    }
    const data = {
        "roomId" : "",
        "name" : "wizi",
        "message" : chatInput.value,
    }
    stomp.send("/pub/chat", {}, JSON.stringify(data));
    chatInput.value = "";
})

const sockJs = new SockJS("/stomp");
const stomp = Stomp.over(sockJs);
stomp.debug = () => {};

stomp.connect({}, () => {
    stomp.subscribe("/sub/enter", ({body}) => {
        addAdminMessage(JSON.parse(body));
    });

    stomp.subscribe("/sub/chat", ({body}) => {
        addChatMessage(JSON.parse(body));
    })

    stomp.send("/pub/enter", {}, JSON.stringify({"name": "test"}));
})

const addAdminMessage = (message) => {
    const p = document.createElement("p");
    p.classList.add("message--admin");
    p.textContent = `${message.message}`;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
}

const addChatMessage = (message) => {
    const p = document.createElement("p");
    p.textContent = `${message.name}: ${message.message}`;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
}