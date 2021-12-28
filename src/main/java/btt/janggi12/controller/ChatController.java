package btt.janggi12.controller;

import btt.janggi12.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping(value = "/enter")
    @SendTo("/sub/enter")
    public ChatMessageDto enter(ChatMessageDto message){
        message.setMessage(message.getName() + "님이 채팅방에 참여하였습니다.");
        return message;
    }

    @MessageMapping(value = "/chat")
    public void message(ChatMessageDto message){
        simpMessagingTemplate.convertAndSend("/sub/chat" + message.getRoomId(), message);
    }
}
