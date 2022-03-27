package com.Active.kalam.controller;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.Active.kalam.model.ChatMessage;
import com.Active.kalam.model.User;
import com.Active.kalam.model.ChatMessage.MessageType;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
@Controller
public class ChatController {

    static HashMap<Integer, String> users= new HashMap<Integer, String>();
    int counter=0;

    @MessageMapping("/chat.register")
    @SendTo("/topic/public")
    public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        users.put(counter, chatMessage.getSender());

        ArrayList<User> list = new ArrayList<User>();
        for (Map.Entry<Integer, String> entry : users.entrySet()) {
            Integer key = entry.getKey();
            String val = entry.getValue();
            list.add(new User(key, val));
        }
        chatMessage.setUsers(list);
        counter++;
        return chatMessage;
    }


    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        if(chatMessage.getType().equals(MessageType.LEAVE)){
            users.remove(chatMessage.getId());
        }
        return chatMessage;
    }
}
